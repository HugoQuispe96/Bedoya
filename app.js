var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var jefe = require('./routes/api/jefe');
var scout = require('./routes/api/scout');
var unidad = require('./routes/api/unidad');
var plan_adelanto = require('./routes/api/plan_adelanto');
var cuadro_plan_adelanto = require('./routes/api/cuadro_plan_adelanto');
var requisito_cuadro = require('./routes/api/requisito_cuadro');
var login = require('./routes/api/login');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));



var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://user_gsk31:TEjETqFSo23CtuiR@dbgsk31-pxqdr.mongodb.net/test?retryWrites=true&w=majority');
var db = mongoose.connection;
db.on('error', (err) => {
    console.log("error", err);
});
db.once('open', () => {
    console.log("conectado");
});

app.use(function(req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/', indexRouter);
app.use('/login', login);
app.use('/jefe', jefe);
app.use('/scout', scout);
app.use('/unidad', unidad);
app.use('/plan', plan_adelanto);
app.use('/cuadro', cuadro_plan_adelanto);
app.use('/requisito', requisito_cuadro);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;