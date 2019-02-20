import axios, { AxiosResponse } from 'axios';
import { username, password } from './secrets';
const base64 = require('base-64');

const encodedCredentials = base64.encode(`${username}:${password}`);

const projectName = 'Projecto chido prueba 2';
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
});