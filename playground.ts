import axios from 'axios';
import { username, password } from './secrets';
const base64 = require('base-64');

const createRepository = (repositoryName: string): void => {
    const encodedCredentials = base64.encode(`${username}:${password}`);
    axios({
        method: 'post',
        url: `https://api.bitbucket.org/2.0/repositories/kantostudio/${repositoryName}`,
        data: {
            'scm': 'git',
            'is_private': 'true',
            'fork_policy': 'no_public_forks' 
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`
        }
      }).then((result) => {
          console.log('Repository created!');
      }, (error) => {
          console.error(error);
      });
}

createRepository('proyectonsio2');