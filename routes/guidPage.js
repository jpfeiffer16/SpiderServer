const fs = require('fs'),
      uuid = require('uuid'),
      handlebars = require('handlebars');

module.exports = function(app) {
  app.get('/guid/:guid', function(req, res) {
    process.hitCount++;
    if (process.hitCount < process.settings.maxHits) { 
      fs.readFile('pages/page.hbs', 'utf-8', function(err, text) {
        if (err) {
          res.statusCode = 500;
          logHit(req, res);
          res.end(err);
          return;
        }

        //Apply randomized response code here if necessary
        if (process.settings.responseCodes && process.hitCount > 20) {
          let min = 0;
          let max = process.settings.responseCodes.length - 1;
          let randomIndex =  Math.floor(Math.random() * (max - min + 1) + min);
          res.statusCode = process.settings.responseCodes[randomIndex];
        }

        var context = {
          pagePath: '',
          links: [],
          statusCode: res.statusCode
        };

        for (var i = 0; i < process.settings.numberOfLinksPerPage; i++) {
          var thisuuid = uuid.v4();
          context.links.push({ uuid: thisuuid });
        }

        var template = handlebars.compile(text);
        logHit(req, res);
        res.send(template(context));
      });
    } else {
      logHit(req, res);
      res.send('maxHits exceeded.');
    }
  });
}

function logHit(req, res) {
  console.log(` > ${ process.hitCount } | ${ res.statusCode } | ${ req.url }`);
}