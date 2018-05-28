
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

	//var k = {"make":"Nissan","modal":"Terrano","chasisno":"SD23FERTS34DF","date":"1527235154","VIN":"X4SD23FERTS34DF","serviceSchedule":[{"service_1":{"schedule":2000,"date":"1527235154","actual":2000},"service_2":{"schedule":3000,"date":"1527235154","actual":3400}}],"replacement":[{"part_1":[{"schedule":2000,"date":"1527235154","actual":2000},{"schedule":2000,"date":"1527235154","actual":2000}]},{"part_2":[{"schedule":2000,"date":"1527235154","actual":2000}]}]} ;
	var k = JSON.parse(req.body.data);
	var gpoints=k.points;
	var services = k["serviceSchedule"];
	var replacement = k["replacement"];
	console.log(services);

	for(i in services)
	{
		for( s in services[i]){

			var v = services[i][s];
			if(v.schedule >= v.actual){
				services[i][s]["points"] = 500;
				gpoints += services[i][s]["points"];
			}
			else{
				services[i][s]["points"] = 400;
				gpoints += services[i][s]["points"];
			}
		}
	}

	console.log("####updated####", k["serviceSchedule"]);
	console.log("####services####", services);
	var j = replacement.length;
	for(i=0;i<j;i++){
		for(parts in replacement[i])
		{
			for( s in replacement[i][parts]){

				var v = replacement[i][parts][s];
				if(v.schedule >= v.actual){
					replacement[i][parts][s]["points"] = 500;
					gpoints += replacement[i][parts][s]["points"];
				}
				else{
					replacement[i][parts][s]["points"]= 400;
					gpoints += replacement[i][parts][s]["points"];
				}
			}
		}
	}

	k["gpoints"] = gpoints;
	createCar.registerCar(JSON.stringify(k)).then((data) => {
		res.json({res: data})
	})
});

router.post('/query', function(req,res){
	query.allCarDetails(req.body).then((data) => {
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