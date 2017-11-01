var routes_session = require('./routes_session')
var routes_api     = require('./routes_api')
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var morgan         = require('morgan');
var express        = require('express');
var session        = require('express-session');
var app            = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
ù
//Secutiry
var helmet = require('helmet')
app.use(helmet())
app.disable('x-powered-by')

// Session
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    key: 'account_sid',
    secret: 'pGyDcBO8W39UaRuw',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('account_sid');
    }
    next();
});

var port = process.env.PORT || 3000;
app.use('/api', routes_api);
app.use('/', routes_session);

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
console.log('Server started on port : ' + port);
