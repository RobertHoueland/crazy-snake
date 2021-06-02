var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
//var twitData = require('./twitData.json')

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'));

app.get('/', function(req, res, next){
  if(twitData){
      res.status(200).sendFile(__dirname + '/public/index.html')
  }
  else {
    next();
  }
});

app.get('*', function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
