
const connect = require('connect'),
  serveStatic = require('serve-static'),
  open = require('open'),
  request = require('request-promise');

const openBrowserOnListen = true;

const app = connect()

app.use(serveStatic(__dirname), {dotfiles:'ignore'})

app.use('/test', function getDirectoriesHandler(req, res, next) {
  getDirectories();
  res.end('')
});

function getDirectories() {
  const options = {
    method: 'GET',
    uri: 'http://localhost:5011/get-directories'
  }
  request(options)
    .then(function getDirectoriesHandler(data) {
      console.log(data);
    });
}

app.listen(5012, function function_name(argument) {
  if (openBrowserOnListen) open('http://localhost:5012/')
});

