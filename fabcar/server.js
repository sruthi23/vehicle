
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

	var k = {"make":"Nissan","modal":"Terrano","chasisno":"SD23FERTS34DF","date":"1527235154","VIN":"X4SD23FERTS34DF","serviceSchedule":[{"service_1":{"schedule":2000,"date":"1527235154","actual":2000},"service_2":{"schedule":3000,"date":"1527235154","actual":3400}}],"replacement":[{"part_1":[{"schedule":2000,"date":"1527235154","actual":2000},{"schedule":2000,"date":"1527235154","actual":2000}]},{"part_2":[{"schedule":2000,"date":"1527235154","actual":2000}]}]} ;
	var services = k["serviceSchedule"];
	var replacement = k["replacement"];
	console.log(services);
	k = JSON.stringify(k);
	//const k = "{\"key\":\"value\"}";
	for(i in services)
	{
		for( s in services[i]){

			//console.log(services[i][s]);
			var v = services[i][s];
			if(v.schedule >= v.actual)
				v["points"] = 500;
			else
				v["points"] = 400;
			
		}
	}

	k["serviceSchedule"] = services;
	console.log(k);

	console.log("replacement"+replacement);
			/*	createCar.registerCar(k).then((data) => {
		res.json({res: data})
	})*/
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