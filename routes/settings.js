const fs = require('fs'),
      handlebars = require('handlebars');

module.exports = function(app) {
  app.get('/settings', function(req, res) {
    //Retrieve settings here.
    if (!process.settings) {
      process.settings = JSON.parse(
        fs.readFileSync('defaultSettings.json', 'utf-8')
      );
    }
    fs.readFile('pages/settings.hbs', 'utf-8', function(err, text) {
      if (err) {
        res.statusCode = 500;
        res.send('Unable to load view.');
        return;
      }
      
      let context = {
        settings: JSON.stringify(process.settings)
      };

      var template = handlebars.compile(text);
      res.send(template(context));

    });
  });

  app.post('/settings', function(req, res) {
    //Save settings here.
    console.log(req.body.settings);
    process.settings = JSON.parse(req.body.settings);
    res.redirect('/settings');
  });
}