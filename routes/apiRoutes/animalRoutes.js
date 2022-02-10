

const router = require('express').Router();
const {filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const {animals} = require('../../data/animals');




router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
  // we have to pay attention to the order of the routes. A param route must come after
  // the other GET route.
  // req.query is multifaceted, often combining multiple parameters,
  // req.param is specific to a single property, often to retrieve a single record.
  router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
  





  router.post('/animals', (req, res) => {
      // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
      // if any data in req.boyd is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });
  
  module.exports = router;