
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var createCar = require('./invoke.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/',function(req, res) {

	res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/invoke',function(req, res) {	

	var carno = req.body.carno;
	var make = req.body.make;
	var model = req.body.model;
	var year = req.body.year;
	var vin = req.body.vin;
	var plate = req.body.plate;
	var engine = req.body.engine;
	createCar.registerCar(req.body);
	res.json({ res: 'invoke!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);