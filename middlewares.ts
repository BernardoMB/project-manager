import { Application, Request, Response } from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

export class Middlewares {

    public static initialize(app: Application): void {
        app.use(morgan('dev', {
            skip: (req: Request, res: Response) => res.statusCode < 400,
            stream: process.stderr
        }));
        app.use(morgan('dev', {
            skip: (req: Request, res: Response) => res.statusCode >= 400,
            stream: process.stdout
        }));
        // Set a 50mb limit to allows us to generate reports from large HTML strings
        app.use(bodyParser.json({limit: '50mb'}));
    }

}