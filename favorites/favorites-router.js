const express = require('express');
const path = require('path');
const moment = require('moment');
const ical = require('ical-generator');
const serviceFunctions = require('../src/serviceFunctions');

const favoritesRouter = express.Router();
const jsonParser = express.json();

favoritesRouter

  .route('/generate')

  .post(jsonParser, (req, res, next) => {

    const games = req.body

    const calendarEvents = serviceFunctions.formatICalEvents(games)

    ical({
        events: calendarEvents
    }).serve(res);

  })

  

module.exports = favoritesRouter;
