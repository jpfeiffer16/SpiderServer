// Usage: node app.js <maxHits> <numberOfLinksPerPage> <port>

const port = 
        process.argv[4] != undefined ?
          parseInt(process.argv[4]) : 
          process.env.PORT,
      path = require('path'),
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      fs = require('fs');

//Setup initial globabl values.
process.settings = JSON.parse(
  fs.readFileSync('./defaultSettings.json', 'utf-8')
);
process.hitCount = 0;

//Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));

//Start the server
app.listen(port, function () {
  console.log('Server running at http://localhost:' + port + '/');
});

//Set up routes
fs.readdir('./routes', (err, files) => {
  if (err) {
    console.error(err);
  }

  files.forEach(function(file) {
    require(path.normalize(
      path.join(
        __dirname,
        'routes',
        file
      )
    ))(app);
  });
});