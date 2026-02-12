import express from "express";

import cnic from "./cnic/index.js";


export default function (app: express.Application) {
  app.use("/cnic", cnic);
}
