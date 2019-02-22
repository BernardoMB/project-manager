import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { username, password } from "./secrets";
import * as FormData from "form-data";
import * as fs from "fs";
const base64 = require("base-64");
const path = require("path");

const encodedCredentials = base64.encode(`${username}:${password}`);

// Create project
/* const projectName = 'Projecto chido prueba 2';
const projectKey = 'ChidoProbonsio2';
const projectDescription = 'Projecto de prueba creado con la applicacion para pipelines.';
const isPrivate = true;
axios({
    method: 'post',
    url: `https://api.bitbucket.org/2.0/teams/kantostudio/projects/`,
    data: {
        'name': `${projectName}`,
        'key': `${projectKey}`,
        'description': `${projectDescription}`,
        'is_private': isPrivate
    },
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`
    }
}).then((response: AxiosResponse) => {
    const responseBody = response.data;
    const message = `Porject ${responseBody.name} created!`;
    console.log(responseBody);
}, (error) => {
    console.log(error.response.data.error);
}); */

// Create commit.
/* const teamName = "kantostudio";
const repo_slug = "pruebistles3";
const encodedMessage = encodeURI("My message");
let form: FormData = new FormData();
form.append("README.md", fs.createReadStream(__dirname + "/files/README.md"), {
  filename: "README.md"
});
axios({
  method: "post",
  url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/src`,
  headers: {
    Authorization: `Basic ${encodedCredentials}`,
    ...form.getHeaders()
  },
  data: form
}).then(
  (res: AxiosResponse) => {
    console.log("Todo chido");
    console.log(res);
  },
  error => {
    console.log(error);
  }
); */

// Read commits
const teamName = "kantostudio";
const repo_slug = "pruebistles3";
axios({
  method: "get",
  url: `https://api.bitbucket.org/2.0/repositories/${teamName}/${repo_slug}/commits/`,
  headers: {
    Authorization: `Basic ${encodedCredentials}`
  }
}).then(
  (res: AxiosResponse) => {
    console.log("Todo chido!");
    console.log(typeof res.data.values[0].hash);
  },
  error => {
    console.log(error);
  }
);

// Create branch
/* axios({
    method: 'post',
    url: `https://api.bitbucket.org/2.0/repositories/kantostudio/pruebistles3/refs/branches`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`
    },
    data: {
        'name': 'smf/Development',
        'target': {
            "hash": "default",
        }
    }
}).then((res: AxiosResponse) => {
    const responseBody = res.data;
    const message = `Repository ${responseBody.name} created!`;
    console.log(message);
}, (error: AxiosError) => {
    const err = error.response.data.error
    console.log(err);
}); */
