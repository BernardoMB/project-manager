import { Request, Response } from 'express';
import axios, { AxiosResponse, AxiosError } from "axios";
import { username, password } from "./../secrets";
import * as FormData from "form-data";
import * as fs from "fs";
const base64 = require("base-64");

export class BitbuckerController {

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
            console.log('Encoded credentials', encodedCredentials);
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
                console.log(message);
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
                const teamName = "kantostudio";
                message = `Repository ${responseBody.name} created under ${projectName} project!`;
                console.log(message);
                /**
                 * TODO: Generate README.md file
                 */
                let form: FormData = new FormData();
                form.append(
                    "README.md",
                    fs.createReadStream(__dirname + "/../files/README.md"),
                    {
                        filename: "README.md"
                    }
                );
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
                message = `Succesfully commited README.md file!`;
                console.log(message);
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
                console.log('Hash', hash);
                // Create Development brac
                console.log('Creating development branch...');
                res = await axios({
                    method: "post",
                    url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/refs/branches`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${encodedCredentials}`
                    },
                    data: {
                        name: "smf/Development",
                        target: {
                            hash: hash
                        }
                    }
                });
                console.log('Todo chido!');
                // Create Realease brach
                res = await axios({
                    method: "post",
                    url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/refs/branches`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${encodedCredentials}`
                    },
                    data: {
                        name: "smf/Realease",
                        target: {
                            hash: hash
                        }
                    }
                });
            } catch (error) {
                console.log('Mamo el pedo');
            }
        } catch (error) {
            console.log('Got bad request');
            console.error(error);
            response.status(400).json({ error });
        }
    };

}
