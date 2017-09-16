
const connect = require('connect'),
  serveStatic = require('serve-static'),
  open = require('open'),
  request = require('request-promise'),
  jsonProxy = require('./proxy');

const openBrowserOnListen = true;

const app = connect()

app.use(jsonProxy("/jsonproxy"));
app.use(serveStatic(__dirname), {dotfiles:'ignore'})

app.use('/test', function getDirectoriesHandler(req, res, next) {
  getDirectories();
  res.end('')
});


app.listen(5012, function function_name(argument) {
  if (openBrowserOnListen) open('http://localhost:5012/')
});

