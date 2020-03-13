require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const fooRouter = require('../foo/fooRouter')
const barRouter = require('../bar/barRouter')
const rawResults = require('../results.json')


const app = express()

// Only turn this on if you want to generate new data,
// and then turn it off, since nodemon will loop infinitely
// generateNewData = require('./ObjectGenerator')
reSTORE = require('./reSTORE.json')

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  }))
  app.use(cors())
  app.use(helmet())


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

app.use('/api/foo', fooRouter);
app.use('/api/bar', barRouter);

console.log(process.env.API_TOKEN)

//////////////////////////////////

app.get('/', (req, res) => {

  const results = rawResults[0].concat(rawResults[1], rawResults[2], rawResults[3], rawResults[4], rawResults[5], rawResults[6]);

  const resultsWithNullDatesRemoved = results.filter(game => game.expected_release_day != null)

  res.send(results);
  console.log(results.length);
  // console.log(certainDates[0].expected_release_month === '2');
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