var routes         = require('./routes');
var ejs_routes     = require('./ejs_routes');
var express        = require('express');
var bodyParser     = require('body-parser');
var app            = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

var port = process.env.PORT || 3000;
app.use('/api', routes);

// set ejs as view engine
app.set('view engine', 'ejs');
app.use('/app', ejs_routes);

// serve assets with static route
app.use('/assets', express.static('assets'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.json({error: err.name, message: err.message});
});

app.listen(port);
module.exports = app;
console.log('Server started on port : ' + port);
