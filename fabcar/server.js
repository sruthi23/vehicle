
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var createCar = require('./invoke.js');
var registerUser = require('./registerUser.js');
var query = require('./query.js');
var changeowner = require('./changeowner.js');
var history = require('./history.js');
var activity = require('./activity.js');

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

	//req.body.carno = req.body.vin;
//JSON.parse(req.body)
console.log(req.body);
createCar.registerCar(JSON.parse(req.body.data)).then((data) => {
	res.json({res: data})
})
});

router.post('/registerUser', function(req, res){
	registerUser.registerNewUser(req.body).then((data) => {
		res.json({res: data})
	})

});

router.post('/query', function(req,res){
	query.allCarDetails(req.body).then((data) => {
		res.json({res: data})
	})

});

router.post('/changeowner',function(req,res){
	changeowner.changeOwner(req.body).then((data) => {
		res.json({res: data})
	})

});

router.post('/history',function(req,res){
	history.allCarHistory(req.body).then((data) => {
		res.json({res: data})
	})

});

router.post('/activity',function(req,res){
	activity.activityDetails(req.body).then((data) => {
		res.json({res: data})
	})

});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);