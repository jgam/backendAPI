var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true); // 1
mongoose.set('useFindAndModify', false); // 1
mongoose.set('useCreateIndex', true); // 1
mongoose.connect(
  'mongodb+srv://jgam:19921019@cluster0-itx5s.mongodb.net/test?retryWrites=true&w=majority'
); // 2
var db = mongoose.connection; // 3
// 4
db.once('open', function() {
  console.log('DB connected');
});
// 5
db.on('error', function(err) {
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); //this is bodyParser
app.use(bodyParser.urlencoded({ extended: true })); //bodyParser url encoding

// DB schema
var contactSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String }
});
var Contact = mongoose.model('contact', contactSchema); //created model for contactSchema

app.get('/', function(req, res) {
  res.redirect('/contacts');
});

app.get('/contacts', function(req, res) {
  Contact.find({}, function(err, contacts) {
    if (err) return res.json(err);
    res.render('contacts/index', { contacts: contacts });
  });
});

app.get('/contacts/new', function(req, res) {
  res.render('contacts/new'); //contact get response
});

app.post('/contacts', function(req, res) {
  Contact.create(req.body, function(err, contact) {
    if (err) return res.json(err);
    res.redirect('/contacts');
  });
});

// Port setting
var port = 3000;
app.listen(3000, function() {
  console.log('server on! http://localhost:' + port);
});
