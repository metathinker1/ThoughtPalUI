
const connect = require('connect'),
  serveStatic = require('serve-static'),
  open = require('open');

const openBrowserOnListen = true;

const app = connect()

app.use(serveStatic(__dirname), {dotfiles:'ignore'})

app.use('/', function mainPageHandler(req, res, next) {
  res.end('')
});

app.listen(5012, function function_name(argument) {
  if (openBrowserOnListen) open('http://localhost:5012/')
});

