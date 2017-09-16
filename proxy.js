var http = require('http')
    https = require('https'),
    url = require('url'),
    request = require('request'),
    NodeCache = require( "node-cache"),
    targetCache = new NodeCache( { stdTTL: 29, checkperiod: 60 } );

var blacklistedRequestHeaders = ["url", "cache-control", "pragma", "connection","accept-encoding", "content-encoding","cookie","user-agent", "host", "referer", "x-requested-with"];
var blacklistedResponseHeaders = ["set-cookie","connection","transfer-encoding","cache-control","server","date"];
var whitelistedUrlProperties = ["protocol", "host", "port", "hostname", "path"];


// validates that a string is a valid fully qualified url
var urlPattern = new RegExp('^(https?:\\/\\/)');

module.exports = function(proxyPath) {    
    return function handle(req, res, next) {        
        // console.log("Method: " + req.method)
        if (req.method === "OPTIONS") {
            // console.log("got a CORS preflight request");            
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "*");
            res.end();     
        } else {
            var remoteUrl = req.headers.url;
            var isRemoteUrlValid = false;
            if (proxyPath && req.url === proxyPath) {
                try {
                    url.parse(remoteUrl);
                    isRemoteUrlValid = true;
                } catch (e) {
                    err.customMessage = "Set the URL you want proxied as a request header, e.g. Url: http://www.google.com/";
                    res.end(JSON.stringify(err, undefined, 2));
                }
            }
            remoteUrl = req.url.substring(1);
            if (!isRemoteUrlValid && urlPattern.test(remoteUrl)) {
                try {
                    url.parse(remoteUrl);
                    isRemoteUrlValid = true;
                } catch (e) {
                    err.customMessage = "The URL provided in the path was not valid.";
                    res.end(JSON.stringify(err, undefined, 2));
                }
            }       
            if (isRemoteUrlValid) {
                var cachedResponse = targetCache.get(remoteUrl);
                if (cachedResponse && req.headers.pragma != "no-cache") {
                    // writes the cached response to the client
                    forEach(cachedResponse.headers, function (k, v) {
                        res.setHeader(k, v);
                    });
                    res.writeHead(cachedResponse.statusCode);
                    res.end(cachedResponse.body);
                } else {
                    proxy(remoteUrl, req, res);
                }
            } else {
                next();
            }        
        }
    };
}

function proxy(remoteUrl, req, res) {
    var data = {
        method: req.method,
        url: remoteUrl,
        headers: except(req.headers, blacklistedRequestHeaders)
    };
    // console.log("proxying: " + req.method + " " + data.url);
    //console.log(data.headers);

    var cachedResponse = { };

    request(data, function (error, response, body) {
        if (error) {
            console.log(error);
            res.writeHead(500);
            res.end();
            return;
        }
        else
        {
            cachedResponse.statusCode = response.statusCode;
            cachedResponse.body = body;
            cachedResponse.headers = except(response.headers, blacklistedResponseHeaders);

            targetCache.set(data.url,cachedResponse);
            //console.log(response.statusCode + " " + data.url);
            //console.log(cachedResponse.headers);

            forEach(cachedResponse.headers, function(k,v) {
                res.setHeader(k,v);
            });
            res.writeHead(response.statusCode);
            res.end(body);
        }
    });
}

// given an object and an array of property names, returns a new object with only those properies present
function pick(o, props) {
    var keys = Object.keys(o);
    var len = keys.length;
    var out = {};
    for(var i=0; i<len;i++) {
        var k=keys[i];
        if (props.indexOf(k) > -1) out[k]=o[k];
    }
    return out;
}
// given an object and an array of property names, returns a new object with only properies not present in the list
function except(o, props) {
    var keys = Object.keys(o);
    var len = keys.length;
    var out = {};
    for(var i=0; i<len;i++) {
        var k=keys[i];
        if (props.indexOf(k) === -1) out[k]=o[k];
    }
    return out;
}
// iterates the properties on an an object and passes the key and value to a delegate
function forEach(o, action) {
    var keys = Object.keys(o);
    for(var i=0, len=keys.length; i<len;i++) {
        var key=keys[i];
        var val=o[key];
        action(key, val);
    }    
}