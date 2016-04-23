var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.json({something: 'something'});
});

app.listen(3000, function() {
  console.log('server started on port 3000');
});