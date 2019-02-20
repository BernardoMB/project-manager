import * as express from 'express';
import { BitbucketRoutes } from './routes/BitbucketRoutes';

export class Api {
    // Global route handling for when matching the desired address
    public static initialize(app: express.Application): void {
        app.use('/api/bitbucket/project', new BitbucketRoutes().routes);
    }
}
