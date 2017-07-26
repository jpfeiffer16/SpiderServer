const uuid = require('uuid');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.redirect('/guid/' + uuid.v4());
  });
}