require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment');
const { NODE_ENV } = require('./config');
const releasesRouter = require('../releases/releases-router');
const favoritesRouter = require('../favorites/favorites-router');
const rawResults = require('../results.json');
const serviceFunctions = require('./serviceFunctions');

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  }));
app.use(cors());
app.use(helmet());

app.use('/api/releases', releasesRouter);
app.use('/api/favorites', favoritesRouter);

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: 'Server error' }
    } else {
      console.error(error)
      response = { error: error.message, object: error }
    }
    res.status(500).json(response)
  })
  
module.exports = app