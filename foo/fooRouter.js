const express = require('express');
const fooRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('../logger');
const { foos, bars } = require('../reSTORE')

//////////////////////////////////
//////////////////////////////////
///////// ROUTE /foo/ ///////////
//////////////////////////////////
//////////////////////////////////

fooRouter
  .route('/foo')

  //////////////////////////////////
  ////////// GET /foo /////////////
  //////////////////////////////////  

  .get((req, res) => { 

    let response = foos;

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

    res.json(foos)
  
  })

  //////////////////////////////////
  ////////// POST /foo ////////////
  //////////////////////////////////

  .post(bodyParser, (req, res) => {
    const { title, content } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    
    if (!content) {
      logger.error(`Content is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    // get an id
    const id = uuid();

    const foo = {
      id,
      title,
      content
    };
  
    foos.push(foo);

    logger.info(`foo with id ${id} created`);

    res
    .status(201)
    .location(`http://localhost:8000/foo/${id}`)
    .json({foo});
  })

//////////////////////////////////
//////////////////////////////////
//////// ROUTE /foo/:id /////////
//////////////////////////////////
//////////////////////////////////

fooRouter
  .route('/foo/:id')

  //////////////////////////////////
  ///////// GET /foo/:id //////////
  //////////////////////////////////

  .get((req, res) => {
    const { id } = req.params;
    const foo = foos.find(c => c.id == id);

    // make sure we found a foo
    if (!foo) {
        logger.error(`foo with id ${id} not found.`);
        return res
        .status(404)
        .send('foo not found');
    }

    res.json(foo);
  })

  //////////////////////////////////
  //////// DELETE /foo/:id ////////
  //////////////////////////////////

  .delete((req, res) => {
    const { id } = req.params;

    const fooIndex = foos.findIndex(c => c.id == id);

    if (fooIndex === -1) {
      logger.error(`foo with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    //remove foo from bars
    //assume fooIds are not duplicated in the fooIds array
    bars.forEach(bar => {
      const fooIds = bar.fooIds.filter(cid => cid !== id);
      bar.fooIds = fooIds;
    });

    foos.splice(fooIndex, 1);

    logger.info(`foo with id ${id} deleted.`);

    res
      .status(204)
      .end();
  })

module.exports = fooRouter;