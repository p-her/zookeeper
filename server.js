const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
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