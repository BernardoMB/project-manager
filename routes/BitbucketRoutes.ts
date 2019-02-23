import { Router } from "express";
import { BitbuckerController } from "../controllers/BitbucketControllers";

const router = Router();

export class BitbucketRoutes {

  private controller: BitbuckerController;

  constructor() {
    this.controller = new BitbuckerController();
  }

  get routes(): Router {
    const controller = this.controller;
    router.post("/pipeline/create", controller.createPipeline);
    return router;
  }

}
