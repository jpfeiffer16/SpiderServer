const fs = require('fs');
const uuid = require('uuid');
const handlebars = require('handlebars');

module.exports = function(app) {
  app.get('/guid/:guid', function(req, res) {
    process.hitCount++;
    console.log('Hit at ' + Date() + ", Hits: " + process.hitCount + ", " + req.url);
    console.log(req.params.guid);
    if (process.hitCount < process.settings.maxHits) { 
      fs.readFile('pages/page.hbs', 'utf-8', function(err, text) {
        if (err) {
          res.statusCode = 500;
          res.end();
          return;
        }

        var context = {
          pagePath: '',
          links: []
        };
        for (var i = 0; i < process.settings.numberOfLinksPerPage; i++) {
          var thisuuid = uuid.v4();
          context.links.push({ uuid: thisuuid });
        }
        var template = handlebars.compile(text);
        res.send(template(context));
      });
    } else {
      res.send('maxHits exceeded.');
    }
  });

  app.get('/', function(req, res) {
    res.redirect('/guid/' + uuid.v4());
  });
}