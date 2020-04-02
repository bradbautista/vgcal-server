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
  
  // Eventually will be for updating favorites number
  .patch(jsonParser, (req, res, next) => {
    const room = req.url.slice(1);

    const { msg } = req.body;

    RoomsService.addToConversation(req.app.get('db'), msg, room)
      .then(() => res.status(201).json({ message: 'Conversation updated.' }))
      .catch(next);
  });


  

module.exports = favoritesRouter;
