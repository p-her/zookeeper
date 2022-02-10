
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const PORT = process.env.PORT || 3001;
const app = express();

// we added middleware to our server and used express.static() method. The way
// it works is taht we provide a file path to a location in our application public foler
// and instruct the server to make these files staic resources. This means that all
// our front-end code can now be accessed without having a specific server endpoint created for it
app.use(express.static('public'));

// express.urlencoded({extended: true}) method is a method built into
// Express.js. It takes incoming POST data and converts it to key/value paring
// that can be accessed in the req.body object. The extended: true option set inside
// the method call informs our server that there may be sub-array data nested in it as well,so
// it needs to look as deep into the POST data as possible to parse all of the data correctly.
// express.json() method takes incoming POST data in the form of JSON and pareses it
// into the req.body Javascript object. Both of the above middleware functions need to be set up
// everytime you create a server that's looking to accept POST data.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
