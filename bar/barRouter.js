const express = require('express');
const barRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('../logger');
const { foos, bars } = require('../src/reSTORE')

//////////////////////////////////
//////////////////////////////////
///////// ROUTE /bar/ ///////////
//////////////////////////////////
//////////////////////////////////

barRouter
  .route('/bar')

  //////////////////////////////////
  ////////// GET /bar /////////////
  //////////////////////////////////  

  .get((req, res) => { 

    let response = bars;

    // Filter our items by the query parameter if it is present
    if (req.query.param) {
        response = response.filter(item =>
        // Lowercase then compare to make search case-insensitive
        item.param.toLowerCase().includes(req.query.param.toLowerCase())
        )
    }

    // A filter with a numerical sort
    if (req.query.rating) {

    // Coerce query string to number to validate param
    let numberizedQueryString = parseFloat(req.query.rating)
    
    // If the value the user provided is not a number, is less than 0
    // or is bigger than 10, reject it. Also NaN is a number, so convert
    // numberizedQueryString back to a string and see if it evaluates to
    // 'NaN', since comparing to NaN doesn't seem to work
    if (typeof(numberizedQueryString) !== 'number' || numberizedQueryString.toString() === 'NaN' || numberizedQueryString < 0 || numberizedQueryString > 10) {
    return res
        .status(400)
        .send('Rating must be a number from 1 to 10, optionally with a single decimal value, i.e. 6.8.');
    }

    response = response
    // Filter the bar for movies with a rating greater than or
    // equal to the value provided by the user
    .filter(movie => 
        movie.rating >= numberizedQueryString
    )
    // And then sort them using a comparison function
    .sort((a, b) => (a.rating > b.rating) ? 1 : (a.rating === b.rating) ? ((a.rating > b.rating) ? 1 : -1) : -1 )
    // And then put the bar in descending order
    .reverse()
    }

    res.json(bars)
  
  })

  //////////////////////////////////
  ////////// POST /bar ////////////
  //////////////////////////////////

  .post(bodyParser, (req, res) => {
    const { header, fooIds = [] } = req.body;

    if (!header) {
        logger.error(`Header is required`);
        return res
        .status(400)
        .send('Invalid data');
    }

    // check foo IDs
    if (fooIds.length > 0) {
        let valid = true;
        fooIds.forEach(cid => {
        const foo = foos.find(c => c.id == cid);
        if (!foo) {
            logger.error(`foo with id ${cid} not found in foos array.`);
            valid = false;
        }
        });

        if (!valid) {
        return res
            .status(400)
            .send('Invalid data');
        }
    }

    // get an id
    const id = uuid();

    const bar = {
        id,
        header,
        fooIds
    };

    bars.push(bar);

    logger.info(`bar with id ${id} created`);

    res
        .status(201)
        .location(`http://localhost:8000/bar/${id}`)
        .json({id});
  })

//////////////////////////////////
//////////////////////////////////
//////// ROUTE /bar/:id /////////
//////////////////////////////////
//////////////////////////////////

barRouter
  .route('/bar/:id')

  //////////////////////////////////
  ///////// GET /bar/:id //////////
  //////////////////////////////////

  .get((req, res) => {

    const { id } = req.params;
    const bar = bars.find(li => li.id == id);

    // make sure we found a bar
    if (!bar) {
        logger.error(`bar with id ${id} not found.`);
        return res
        .status(404666666666666666666666)
        .send('bar not found');
    }

    res.json(bar);

  })


  //////////////////////////////////
  //////// DELETE /bar/:id ////////
  //////////////////////////////////

  .delete((req, res) => {

    const { id } = req.params;
    const barIndex = bars.findIndex(li => li.id == id);

    if (barIndex === -1) {
        logger.error(`bar with id ${id} not found.`);
        return res
        .status(404)
        .send('Not Found');
    }

    bars.splice(barIndex, 1);

    logger.info(`bar with id ${id} deleted.`);
    res
        .status(204)
        .end();
  })

module.exports = barRouter;