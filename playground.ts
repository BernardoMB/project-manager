import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { username, password } from './secrets';
import * as FormData from 'form-data';
import * as fs from 'fs';
const base64 = require('base-64');
const path = require('path');

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


const urlUsername = 'kantostudio';
const repo_slug = 'pruebistles3';
let form: FormData = new FormData();
form.append('README.md', fs.createReadStream(__dirname + '/files/README.md'), {
    filename: 'README.md'
});
axios.create({headers: {...(form.getHeaders()), 'Authorization': `Basic ${encodedCredentials}`}}).post(
    `https://api.bitbucket.org/2.0/repositories/${urlUsername}/${repo_slug}/src`,
    form
).then((res: AxiosResponse) => {
    console.log('Todo chido');
}, (error) => {
    console.log(error);
});




/* 
const urlUsername = 'kantostudio';
const repo_slug = 'pruebistles3';
const filePath = path.join(__dirname, 'files/README.md');
const buffer = fs.readFileSync(filePath);
const formData = new FormData3();
formData.append('README.md', buffer);
const options: AxiosRequestConfig = {
    method: 'post',
    url: `https://api.bitbucket.org/2.0/repositories/${urlUsername}/${repo_slug}/src`,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Basic ${encodedCredentials}`,
        'data':  formData
    }
}
axios(options).then((response: AxiosResponse) => {
    console.log('Todo chido!');
}, (error) => {
    console.log(error);
}); */





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
