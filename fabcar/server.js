// BASE SETUP
// =============================================================================

// call the packages we need

var express = require('express'); // call express
var app = express();
var path = require('path'); // define our app using express
var bodyParser = require('body-parser');
var createCar = require('./invoke.js');
var query = require('./query.js');
var pointInfo = require('./points-info.json');
var serviceinfo = pointInfo[0];
var replaceinfo = pointInfo[1];
console.log(replaceinfo);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 8081; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

router.post('/invoke', function(req, res) {
  // var k = {"make":"Nissan","modal":"Terrano","chasisno":"SD23FERTS34DF","date":"1527235154","VIN":"X4SD23FERTS34DF","serviceSchedule":[{"service_1":{"schedule":2000,"date":"1527235154","actual":2000},"service_2":{"schedule":3000,"date":"1527235154","actual":3400}}],"replacement":[{"part_1":[{"schedule":2000,"date":"1527235154","actual":2000},{"schedule":2000,"date":"1527235154","actual":2000}]},{"part_2":[{"schedule":2000,"date":"1527235154","actual":2000}]}]} ;
  var k = JSON.parse(req.body.data);
  var gpoints = k.points;
  var services = k['serviceSchedule'];
  var replacement = k['replacement'];
  // console.log(services);

  for (i in services) {
    for (s in services[i]) {
      var v = services[i][s];
      var temp = v.schedule * 10 / 100;
      var deviation = temp + v.schedule;
      if (v.schedule >= v.actual) {
        console.log(serviceinfo[s]);
        services[i][s]['points'] = serviceinfo[s][0];
        gpoints += services[i][s]['points'];
        services[i][s]['status'] = 0;
      } else if (v.actual > v.schedule && v.actual <= deviation) {
        services[i][s]['points'] = serviceinfo[s][1];
        gpoints += services[i][s]['points'];
        services[i][s]['status'] = 1;
      } else {
        services[i][s]['points'] = serviceinfo[s][2];
        gpoints += services[i][s]['points'];
        services[i][s]['status'] = 2;
      }
    }
  }

  console.log('####updated####', k['serviceSchedule']);
  console.log('####services####', services);
  var j = replacement.length;
  console.log('#####', j);
  for (i = 0; i < j; i++) {
    for (parts in replacement[i]) {
      console.log('#####parts', parts);
      for (s in replacement[i][parts]) {
        console.log('#####parts####', s);

        console.log(
          'replacement_' + (parseInt(s) + 1),
          replaceinfo['replacement_' + (s + 1)]
        );

        var v = replacement[i][parts][s];
        console.log('####v####', v);
        var temp = v.schedule * 10 / 100;
        console.log('####temp####', temp);

        var deviation = temp + v.schedule;
        console.log('####deviation####', deviation);

        if (v.schedule >= v.actual) {
          console.log('####schedule####', replacement[i][parts][s]);
          //replacement[i][parts][s]['points'] = replaceinfo['replacement_' + (parseInt(s) + 1)][0]
          replacement[i][parts][s]['points'] =
            replaceinfo['replacement_' + (parseInt(s) + 1)][0];
          gpoints += replacement[i][parts][s]['points'];
          replacement[i][parts][s]['status'] = 0;
        } else if (v.actual > v.schedule && v.actual <= deviation) {
          //replacement[i][parts][s]['points'] = replaceinfo['replacement_' + (parseInt(s) + 1)][1]
          replacement[i][parts][s]['points'] =
            replaceinfo['replacement_' + (parseInt(s) + 1)][1];
          gpoints += replacement[i][parts][s]['points'];
          replacement[i][parts][s]['status'] = 1;
        } else {
          replacement[i][parts][s]['points'] =
            replaceinfo['replacement_' + (parseInt(s) + 1)][0];
          gpoints += replacement[i][parts][s]['points'];
          replacement[i][parts][s]['status'] = 2;
        }
      }
    }
  }

  k['gpoints'] = gpoints;
  createCar.registerCar(JSON.stringify(k)).then(data => {
    res.json({ res: data });
  });
});

router.post('/query', function(req, res) {
  query.allCarDetails(req.body).then(data => {
    res.json({ res: data });
  });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
