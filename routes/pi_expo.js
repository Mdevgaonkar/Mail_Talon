var express = require("express");
var router = express.Router();
var authHelper = require("../helpers/auth");
const utils = require("../helpers/utils");
const excel_utils = require("../helpers/excel_helper");
const pi_logger = require("../rules/PI_export/pi_logger");

const request = require("request");
const rule_access = require("../rules/rule_access");
const fs = require("fs");

/* get /piexpo */
router.get("/", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let parms = {
    module: "pi_expo",
    auth: false,
    errors: [],
    debug: [],
    body: {
      message: "",
      logStatus:false
    }
  };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);

  if (accessToken) {
    // parms.user = userName;
    parms.auth = true;
    parms.body.message = "Starting PI logger process";
    let loggedPIs = await pi_logger.log_process(req,res);
    parms.body = {...loggedPIs};
    res.send(parms);
  } else {
    // Redirect to home
    res.redirect("/");
  }

  

  // setInterval(() => {
  //   pi_logger.log_process(req)
  // // excel_utils.log_PI_to_excel(req);
  // }, 1000 * 40 * 1); //1000 * 60 * 2
});

module.exports = router;