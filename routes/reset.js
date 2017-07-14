module.exports = function(app) {
  app.get('/reset', function(req, res) {
    process.hitCount = 0;
    res.send('Hit count reset');
  });
}