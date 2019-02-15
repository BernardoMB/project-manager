import { Router, Request, Response } from 'express';

const router = Router();

export class BitbucketRoutes {
    
    constructor () {}

    get routes(): Router {
        router.get('/test', this.testFunction);
        return router;
    }

    public testFunction = (request: Request, response: Response) => {
        try {
            const message = 'Test Bitbucket route works!';
            console.log(message);
                response.status(200).json({message});
        } catch (error) {
            console.error(error);
            response.status(400).json({error});
        }
    }
    
}