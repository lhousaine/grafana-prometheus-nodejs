import express from "express";
import { BaseMiddleware } from "../helpers/BaseMiddleware";
import { ISessionData } from "../helpers/SessionData";

let router = express.Router();

router.get(`/`,
  BaseMiddleware((
    req: express.Request,
    res: express.Response
  ) => {
    res.render('index',
      {
        title: 'Express App',
        welcomeMsg: 'Welcome to the grafana and prometheus integration with nodejs App Demo',
        username: (<ISessionData>req.session).username
      }
    )
  }));
export { router };