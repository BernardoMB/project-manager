import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { username, password } from './../secrets';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as base64 from 'base-64';
import chalk from 'chalk';

async function asyncForEach(array: Array<any>, callback: Function) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export class BitbucketController {

    public createPipeline = async (request: Request, response: Response) => {
        try {
            // Project
            let projectName: string = request.body.projectName;
            let projectKey: string = request.body.projectKey;
            const projectDescription: string = request.body.projectDescription;
            const isPrivate: boolean = request.body.isPrivate;
            // Repository
            let repositoryName: string = request.body.repositoryName;
            const featureBranches: Array<string> = request.body.featureBranches;
            // Authentication
            const encodedCredentials: string = base64.encode(
                `${username}:${password}`
            );
            //console.log('Encoded credentials', encodedCredentials);
            try {
                // Create project
                console.log('Creating project...');
                let res: AxiosResponse = await axios({
                    method: "post",
                    url: `https://api.bitbucket.org/2.0/teams/kantostudio/projects/`,
                    data: {
                        name: `${projectName}`,
                        key: `${projectKey}`,
                        description: `${projectDescription}`,
                        is_private: isPrivate
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${encodedCredentials}`
                    }
                });
                let responseBody = res.data;
                projectName = responseBody.name;
                let message = `Project ${projectName} created!`;
                console.log(chalk.greenBright(message));
                projectKey = responseBody.key;
                // Create repository
                console.log('Creating repository...');
                res = await axios({
                    method: "post",
                    url: `https://api.bitbucket.org/2.0/repositories/kantostudio/${repositoryName}`,
                    data: {
                        scm: "git",
                        project: {
                            key: `${projectKey}`
                        },
                        is_private: isPrivate
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${encodedCredentials}`
                    }
                });
                responseBody = res.data;
                const repo_slug = responseBody.slug;
                const teamName = 'kantostudio';
                message = `Repository ${responseBody.name} created under ${projectName} project!`;
                console.log(chalk.greenBright(message));
                /**
                 * TODO: Generate README.md file
                 */
                let form: FormData = new FormData();
                const readStream: fs.ReadStream = fs.createReadStream(__dirname + '/../files/README.md');
                form.append('README.md', readStream, { filename: 'README.md' });
                // Commit README.md file
                console.log('Uploading readme files...');
                res = await axios({
                    method: "post",
                    url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/src`,
                    headers: {
                        Authorization: `Basic ${encodedCredentials}`,
                        ...form.getHeaders()
                    },
                    data: form
                });
                responseBody = res.data;
                message = `Commited README.md file!`;
                console.log(chalk.greenBright(message));
                // Get the just created commit data
                console.log('Getting latest commit...');
                res = await axios({
                    method: "get",
                    url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/commits/`,
                    headers: {
                        Authorization: `Basic ${encodedCredentials}`
                    }
                });
                let hash = res.data.values[0].hash;
                console.log('Hash', chalk.yellowBright(hash));
                let branches: Array<string> = [
                    'Development',
                    'Release',
                    'Hotfixes',
                    ...featureBranches
                ];
                await asyncForEach(branches, async (branch: string) => {
                    console.log(`Creating ${branch} branch...`);
                    res = await axios({
                        method: "post",
                        url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/refs/branches`,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${encodedCredentials}`
                        },
                        data: {
                            name: `${branch}`,
                            target: {
                                hash: hash
                            }
                        }
                    });
                    message = `${branch} branch created!`;
                    console.log(chalk.greenBright(message));
                });
                message = `\nCreated pipeline!`
                console.log(chalk.cyanBright(message));
                response.status(201).json({ message });
            } catch (error) {
                const bitBucketError = error.response.data.error;
                console.log(chalk.redBright(bitBucketError));
                response.status(400).json({ bitBucketError });
            }
        } catch (error) {
            const message = 'Got bad request'
            console.log(chalk.redBright(message, error));
            response.status(400).json({ error });
        }
    };

}
