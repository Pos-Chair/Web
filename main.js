/*
 * Server for  Pos-Chair
 */

var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, response) {

    var pathname = url.parse(req.url).pathname;

    console.log("Processing request for " + pathname + ".");

    if(pathname === '/')
        pathname += 'index.html';

    ext = pathname.substr(pathname.lastIndexOf('.')+1);

    fs.readFile('web' + pathname, function(err, dat) {
        if(err) {
            console.log(err);
            response.writeHead(404, {'Context-Type': 'text/html'});
        } else {
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

            response.write(dat.toString());
        }

        response.end();

    });

}).listen(80);
