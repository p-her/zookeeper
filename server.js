const { create } = require('domain');
const express = require('express');
const { type } = require('express/lib/response');
const fs = require('fs');
const path = require('path'); // provides utilities for working with file and directory paths
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data

app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());

// express.urlencoded({extended: true}) method is a method built into
// Express.js. It takes incoming POST data and converts it to key/value paring
// that can be accessed in the req.body object. The extended: true option set inside
// the method call informs our server that there may be sub-array data nested in it as well,so 
// it needs to look as deep into the POST data as possible to parse all of the data correctly.
// express.json() method takes incoming POST data in the form of JSON and pareses it
// into the req.body Javascript object. Both of the above middleware functions need to be set up
// everytime you create a server that's looking to accept POST data.



const {animals} = require('./data/animals.json');

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

function filterByQuery(query, animalsArray){
    let personalityTraitsArray = []

    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;

    if(query.personalityTraits){
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if(typeof query.personalityTraits === 'string'){
            // one personalityTrait pass as query parameter
             // example: ?personalityTraits=hungry
            personalityTraitsArray = [query.personalityTraits];
            console.log('one personalityTrait')
        }else{
            // 2 or more personalityTraits pass as query parameter 
            // example: ?personalityTraits=hungry&personalityTraits=zany
            personalityTraitsArray = query.personalityTraits;
            console.log('2 or more personalityTraits')
        }

        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array
            // Remeber, it is initailly a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
            
        });
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);

    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animals.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    return filteredResults;
}


function findByID(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray){
    console.log(body);
    const animal = body;
    // our function's main code will go here!
    animalsArray.push(animal)

    // writeFileSync is a synchronous version of writeFile() and doesn't require
    // callback funtion. If we were to write to a much larger data set, the asynchronous
    // version would be better.
    fs.writeFileSync(
       
    // path.join() to join the value of __dirname, which represents the directory
    // of the file we execute the code in, with the path to the animal.json file
    path.join(__dirname, './data/animals.json'),
    // save the JavaScript array data as JSON
    // null argument means we don't want to edit any of our existing data
    // 2 indicates we want to create white space between our values to make it more readable
    JSON.stringify({animals: animalsArray}, null, 2)
    );
    


    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name != 'string'){
        return false;
    }

    if(!animal.species || typeof animal.species != 'string'){
        return false;
    }

    if(!animal.diet || typeof animal.diet != 'string'){
        return false;
    }

    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits != 'string')){
        return false;
    }

    return true;
}

app.get('/api/animals', (req, res) => {
    // assign animals array to results
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// we have to pay attention to the order of the routes. A param route must come after
// the other GET route.
// req.query is multifaceted, often combining multiple parameters,
// req.param is specific to a single property, often to retrieve a single record.
app.get('/api/animals/:id', (req, res) => {
    const result = findByID(req.params.id, animals);
    if(result){
        res.json(result);

    }else{
        res.send(404);
    }
  
});

app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);

    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();


    // if any data in req.boyd is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formattted.');
    }else{
  

         // add animal to json file and animal's array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
   
});