import { Router } from "express";
import { BitbucketController } from "../controllers/BitbucketControllers";

const router = Router();

export class BitbucketRoutes {

  private controller: BitbucketController;

  constructor() {
    this.controller = new BitbucketController();
  }

  get routes(): Router {
    const controller = this.controller;
    router.post("/pipeline/create", controller.createPipeline);
    return router;
  }

}
