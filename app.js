// Usage: node app.js <maxHits> <numberOfLinksPerPage> <port>

const port = process.argv[4] != undefined ? parseInt(process.argv[4]) : process.env.PORT;
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

process.settings = JSON.parse(fs.readFileSync('./defaultSettings.json', 'utf-8'));
process.hitCount = 0;

app.use(bodyParser.urlencoded());

//Start the server
app.listen(port, function () {
  console.log('Server running at localhost:' + port + '/');
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