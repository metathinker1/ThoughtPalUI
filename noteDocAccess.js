const jquery = $;

const getDirectories = (function($) {
  // Ooops: This is for running in Node (server side)
  // const options = {
  //   method: 'GET',
  //   uri: 'http://localhost:5011/get-directories'
  // }
  // request(options)
  //   .then(function getDirectoriesHandler(data) {
  //     //console.log(data);
  //     $("#note-doc-controller").text(data);
  //   });

  // TODO: Resolve CORS, and then reenable:
  // return function() {
  //   // http://api.jquery.com/jquery.getjson/
  //   $.getJSON('http://localhost:5011/get-directories', function(data) {
  //   	$("#note-doc-controller").text(data);
  //   });
  // }

  return [ 'AAA_Archive','ASD','AlgoTrading'];
  
});
