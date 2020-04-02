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


// Validating the bearer token

// app.use(function validateBearerToken(req, res, next) {

//   const apiToken = process.env.API_TOKEN
//   const authToken = req.get('Authorization')
//   if (!authToken || authToken.split(' ')[1] !== apiToken) {
//       logger.error(`Unauthorized request to path: ${req.path}`);
//       return res.status(401).json({error: 'Unauthorized request'})
//   }

//   // move to the next middleware
//   next()

// })

app.use('/api/releases', releasesRouter);
app.use('/api/favorites', favoritesRouter);


console.log(process.env.API_TOKEN)

//////////////////////////////////

app.get('/', (req, res) => {

  serviceFunctions.getAllReleases(req.app.get('db'))
    .then(releases => {
      res.json(releases)
    })
    .catch(err => console.log(err))

});

//////////////////////////////////

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('A POST request');
});

//////////////////////////////////

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