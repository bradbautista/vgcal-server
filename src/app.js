require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment');
const { NODE_ENV } = require('./config');
const releasesRouter = require('../releases/releases-router');
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


console.log(process.env.API_TOKEN)

//////////////////////////////////

app.get('/', (req, res) => {

  // const results = rawResults[0].concat(rawResults[1], rawResults[2], rawResults[3], rawResults[4], rawResults[5], rawResults[6]);
  const results = rawResults.flat();

  const filteredResults = serviceFunctions.filterReleases(results)
  

  // const filteredResults = results.filter(result => result.expected_release_quarter !== null)

  let arrNo = 0

  // Day-month or month-day?

  // We can reasonably assume that if there is a value for expected_release_quarter, other expected release information will be null, so we can use that value, append a Q to the front of it, concatenate it with the year and have our string.

  const resArr = [results[arrNo].expected_release_year, results[arrNo].expected_release_month, results[arrNo].expected_release_day, results[arrNo].expected_release_quarter].filter(value => value !== null)

  // if the length of that array is 0, is there a value in "original_release_date"; if so, use that, which is in YYYY-MM-DD so that's how we should do it but then we need a solution for quarters

  // res.send(filteredResults);
  // console.log(results[0]);
  // console.log(filteredResults)
  

  // // For a new room, messages will be an empty array; this is fine
  // .get((req, res, next) => {
  //   const room = req.url.slice(1);

  //   // To prevent bugs which could allow users to see the content of
  //   // conversations when they try to join full rooms, reject the request
  //   // if socket.connected logs false on the client side
  //   if (req.headers.isconnected === 'true') {
  //     RoomsService.getAllMessages(req.app.get('db'), room)
  //       .then(messages => {
  //         res.json(messages);
  //       })
  //       .catch(next);
  //   } else if (req.headers.isconnected === 'false') {
  //     return res.status(404).json({
  //       error: {
  //         message: `You have disconnected from the socket, or the room is full.`
  //       }
  //     });
  //   }
  // })

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