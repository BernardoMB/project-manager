import { Router, Request, Response } from 'express';

const router = Router();

export class BitbucketRoutes {
    
    constructor () {}

    get routes(): Router {
        router.get('/test', this.testFunction);
        router.get('/repository/create', this.createProyect);
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

    public createProyect = (request: Request, response: Response) => {
        try {
            const message = 'Function not implemented!';
            console.log(message);
            response.status(500).json({message});
        } catch (error) {
            console.error(error);
            response.status(400).json({error});
        }
    }
    
}