import { Router, Request, Response } from "express";
import axios, { AxiosResponse, AxiosError } from "axios";
import { username, password } from "./../secrets";
const base64 = require("base-64");
import * as FormData from "form-data";
import * as fs from "fs";

const router = Router();

export class BitbucketRoutes {
  constructor() {}

  get routes(): Router {
    router.get("/test", this.testFunction);
    router.get("/project/create", this.handleCreateProject);
    router.get("/repository/create", this.handleCreateRepository);
    router.post("/pipeline/create", this.handleCreatePipeline);
    return router;
  }

  public testFunction = (request: Request, response: Response) => {
    try {
      const message = "Test Bitbucket route works!";
      console.log(message);
      response.status(200).json({ message });
    } catch (error) {
      console.error(error);
      response.status(400).json({ error });
    }
  };

  public handleCreateRepository = (request: Request, response: Response) => {
    try {
      const message = "Function not implemented!";
      console.log(message);
      response.status(500).json({ message });
    } catch (error) {
      console.error(error);
      response.status(400).json({ error });
    }
  };

  public handleCreateProject = (request: Request, response: Response) => {
    try {
      const repositoryName = request.body.repositoryName;
      const encodedCredentials = base64.encode(`${username}:${password}`);
      axios({
        method: "post",
        url: `https://api.bitbucket.org/2.0/repositories/BernardoMBKS/${repositoryName}`,
        data: {
          scm: "git",
          is_private: "true",
          fork_policy: "no_public_forks"
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`
        }
      }).then(
        result => {
          const message = "Repository created!";
          response.status(200).json({ message });
        },
        error => {
          response.status(500).json({ error });
        }
      );
    } catch (error) {
      console.error(error);
      response.status(400).json({ error });
    }
  };

  public handleCreatePipeline = (request: Request, response: Response) => {
    try {
      // Project
      const projectName: string = request.body.projectName;
      const projectKey: string = request.body.projectKey;
      const projectDescription: string = request.body.projectDescription;
      const isPrivate: boolean = request.body.isPrivate;
      // Repository
      const repositoryName: string = request.body.repositoryName;
      const featureBranches: Array<string> = request.body.featureBranches;
      // Authentication
      const encodedCredentials: string = base64.encode(
        `${username}:${password}`
      );
      // Create project.
      axios({
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
      }).then(
        (res: AxiosResponse) => {
          const responseBody = res.data;
          const newProjectName = responseBody.name;
          const message = `Porject ${newProjectName} created!`;
          console.log(message);
          const projectUuid = responseBody.uuid;
          const projectKey = responseBody.key;
          // Create repository.
          axios({
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
          }).then(
            (res: AxiosResponse) => {
              const responseBody = res.data;
              const newRepositoryUniqueIdentifier = responseBody.uuid;
              // Create development branch.
              axios({
                method: "post",
                url: `https://api.bitbucket.org/2.0/repositories/kantostudio/${newRepositoryUniqueIdentifier}/refs/branches`,
                data: {
                  name: "smf/Development",
                  target: {
                    hash: "default"
                  }
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Basic ${encodedCredentials}`
                }
              }).then(
                (res: AxiosResponse) => {
                  const responseBody = res.data;
                  const message = `Repository ${
                    responseBody.name
                  } created under ${newProjectName} project!`;
                  console.log(message);
                  response.status(200).json({ message });
                },
                (error: AxiosError) => {
                  const err = error.response.data.error;
                  console.log(err);
                  response.status(400).json({ error: err });
                }
              );
            },
            (error: AxiosError) => {
              const err = error.response.data.error;
              console.log(err);
              response.status(400).json({ error: err });
            }
          );
        },
        (error: AxiosError) => {
          const err = error.response.data.error;
          console.log(err);
          response.status(400).json({ error: err });
        }
      );
    } catch (error) {
      console.error(error);
      response.status(400).json({ error });
    }
  };

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
      try {
        // Create project
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
        let message = `Porject ${projectName} created!`;
        console.log(message);
        let projectUuid = responseBody.uuid;
        projectKey = responseBody.key;
        // Create repository
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
        message = `Repository ${
          responseBody.name
        } created under ${projectName} project!`;
        console.log(message);
        /**
         * TODO: Generate README.md file
         */
        let form: FormData = new FormData();
        form.append(
          "README.md",
          fs.createReadStream(__dirname + "/files/README.md"),
          {
            filename: "README.md"
          }
        );
        // Commit README.md file
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
        res = await axios({
          method: "get",
          url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/commits/`,
          headers: {
            Authorization: `Basic ${encodedCredentials}`
          }
        });
        let hash = res.data.values[0].hash;
        // Create Development brach
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
      } catch (error) {}
    } catch (error) {
      console.error(error);
      response.status(400).json({ error });
    }
  };
}
