// Usage: node app.js <maxHits> <numberOfLinksPerPage> <port>

var fs = require('fs');
var handlebars = require('handlebars');
var uuid = require('uuid');

var http = require('http'),
    maxHits = process.argv[2] || 100,
    numberOfLinksPerPage = process.argv[3] || 4,
    port = process.argv[4] != undefined ? parseInt(process.argv[4]) : process.env.PORT,
    hitCount = 0;
    
console.log('maxHits: ', maxHits, ", numberOfLinksPerPage:", numberOfLinksPerPage);

http.createServer(function (req, res) {
  var responseString = "";
  res.writeHead(200, {'Content-Type': 'text/html'});

  if (hitCount <= maxHits && req.url.indexOf('favicon.ico') == -1) {
    fs.readFile('page.hbs', 'utf-8', function(err, text) {
      if (err) {
        res.statusCode = 500;
        res.end();
        return;
      }
      var context = {
        pagePath: '',
        links: []
      };
      for (var i = 0; i < numberOfLinksPerPage; i++) {
        var thisuuid = uuid.v4();
        context.links.push({ uuid: thisuuid });
      }
      var template = handlebars.compile(text);
      res.end(template(context));
    });
    hitCount++;
    console.log('Hit at ' + Date() + ", Hits: " + hitCount + ", " + req.url);
  } else if (req.url.indexOf('/reset') != -1) {
    hitCount = 0;
    console.log('Hit count reset');
    res.end('Hit count reset');
  } else if (hitCount > maxHits) {
    console.log('maxHits exceeded');
    res.end('maxHits exceeded');
  } else {
    console.log('Not a document request');
    res.end();
  }
}).listen(port, '0.0.0.0', function() {
  console.log('Server running at localhost:' + port + '/');
});
