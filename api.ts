import * as express from 'express';
import { GitLabRoutes } from './routes/GitLabRoutes';

export class Api {
    // Global route handling for when matching the desired address
    public static initialize(app: express.Application): void {
        app.use('/api/gitlab', new GitLabRoutes().routes);
    }
}
