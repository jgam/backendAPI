var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require("./config/passport");//1
var app = express();

//DB setting

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(
  'mongodb+srv://jgam:19921019@cluster0-itx5s.mongodb.net/test?retryWrites=true&w=majority'
);
var db = mongoose.connection;
db.once('open', function() {
  console.log('DB connected girit!');
});
db.on('error', function(err) {
  console.log('DB ERROR : ', err);
});



// Other settings
app.set('view engine', 'ejs');



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash()); // 2 flash is an array that stores number and string in array as index and element
app.use(session({ secret: 'MySecret', resave: true, saveUninitialized: true })); // 3
// Passport // 2
app.use(passport.initialize());
app.use(passport.session()); 

// Custom Middlewares // 3
app.use(function(req,res,next){
 res.locals.isAuthenticated = req.isAuthenticated();
 res.locals.currentUser = req.user;
 next();
})


//session is to distinguish users and secret is the password for specific session.
//routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts')); //directs to routs posts
app.use('/users', require('./routes/users'));





//port setting
var port = 3000;
app.listen(process.env.PORT|| port, function() {
  console.log('server on! localhost:' + port);
});
