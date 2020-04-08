const express = require('express');
const ical = require('ical-generator');
const serviceFunctions = require('../src/serviceFunctions');

const favoritesRouter = express.Router();
const jsonParser = express.json();

favoritesRouter

  .route('/generate')

  .post(jsonParser, (req, res) => {

    const games = req.body;

    const calendarEvents = serviceFunctions.formatICalEvents(games);

    ical({
        events: calendarEvents
    }).serve(res);

  })

  

module.exports = favoritesRouter;
