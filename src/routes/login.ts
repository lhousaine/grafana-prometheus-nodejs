import express from "express";
import { BaseMiddleware } from "../helpers/BaseMiddleware";
import { ISessionData } from "../helpers/SessionData";
let router = express.Router();

router.get(`/login`,
  BaseMiddleware((
    req: express.Request,
    res: express.Response
  ) => {
    res.render(`login`, {
      title: `Express Login`
    });
  }));

router.post(`/login`,
  BaseMiddleware((
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(`req.body.username : ${req.body.username}`);
    if (req.body.username?.length > 0) {
      console.log(`found body.name`);
      (<ISessionData>req.session).username = req.body.username;
      res.redirect(`/`);
    } else {
      res.render(`login`, {
        title: `Express Login`,
        errorMessage: `Please enter a username and password`
      })
    }
  }));

export { router };