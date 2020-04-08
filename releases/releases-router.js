const express = require('express');
const releasesRouter = express.Router();
const serviceFunctions = require('../src/serviceFunctions')

releasesRouter

  .route('/')
  .get((req, res) => {

    serviceFunctions.getAllReleases(req.app.get('db'))
    .then(releases => {
      res.json(releases);
    })
    .catch(err => console.log(err))

  });

module.exports = releasesRouter;
