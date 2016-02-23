// Usage: node app.js <maxHits> <numberOfLinksPerPage> <port>
var http = require('http'),
    maxHits = process.argv[2] || 100,
    numberOfLinksPerPage = process.argv[3] || 4,
    port = process.argv[4] != undefined ? parseInt(process.argv[4]) : process.env.PORT,
    hitCount = 0;
    
console.log('maxHits: ', maxHits, ", numberOfLinksPerPage:", numberOfLinksPerPage);


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  http.createServer(function (req, res) {
    var responseString = "";
    res.writeHead(200, {'Content-Type': 'text/html'});
  
    if (hitCount <= maxHits && req.url.indexOf('favicon.ico') == -1) {
      for (var i = 0; i < numberOfLinksPerPage; i++) {
        if (Math.random() > .2) {
          var uuid = require('uuid').v4();
          responseString += '<a href="' + uuid + '">' + uuid + '</a>';
        } else {
          responseString += '<a href="https://othersite.com/' + uuid + '">' + uuid + '</a>';
        }
      }
      hitCount++;
      console.log('Hit at ' + Date() + ", Hits: " + hitCount + ", " + req.url);
      res.end(responseString);
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
  }).listen(port, add);
  
  console.log('Server running at ' + add + ':' + port + '/');
});

