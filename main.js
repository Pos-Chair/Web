/*
 * Server for  Pos-Chair
 */

var http = require('http');
var fs = require('fs');
var url = require('url');
var ns = require('node-session');
var spark = require('spark');

var alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var secret = '';
for(var i = 0; i < 32; ++i) {
    secret += alpha.charAt(Math.floor(Math.random()*alpha.length));
}

var sess = new ns({secret: secret, secure: true, encrypt: true});
console.log('Sessions Manager Created with secret: ' + secret);

http.createServer(function (req, response) {

    sess.startSession(req, response, function() {

        var pathname = url.parse(req.url).pathname;

        console.log("Processing request for " + pathname + ".");

        if(pathname === '/')
            pathname += 'index.html';

        var ext = pathname.substr(pathname.lastIndexOf('.')+1);
        var filename = 'web' + pathname;

        fs.stat(filename, function(err, stat) {
            if(err) {
                console.error(err);
                response.writeHead(404, {'Context-Type': 'text/html'});
            } else {
                var type;
                switch(ext) {
                case 'htm':
                case 'html':
                    type = 'text/html';
                    break;
                
                case 'css':
                    type = 'stylesheet';
                    break;

                case 'js':
                    type = 'script';
                    break;

                case 'ico':
                    type = 'x-icon';
                    break;

                default:
                    type = ext;
                }
                response.writeHead(200, {'Context-Type': type});
                
                var stream = fs.createReadStream(filename);
                
                stream.on('open', function() {
                    stream.pipe(response);
                });
                stream.on('error', function(err) {
                    response.end(err);
                    console.error(err);
                });
                stream.on('end', function() {
                    response.end();
                });
            }

        });


    });

}).listen(80);
