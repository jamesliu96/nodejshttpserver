var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;

var port = 3000;
var server = new http.Server();
var time = new Date();
var hits = 0;
var indexPage = "index.htm";
var notFound = "404.htm";

server.on("request", function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var query = url.parse(request.url).query || "";
    pathname = pathname.slice(1) ? pathname : "/" + indexPage;
    var realPath = path.join("assets", pathname);
    console.log("HITS "+hits+": [" + time + "]");
    console.log(pathname);
    console.log(query);
    fs.exists(realPath, function (exists) {
        if (!exists)
            realPath = "assets/" + notFound;
        var ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : "unknown";
        fs.readFile(realPath, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.end(err);
            } else {
                var contentType = mime[ext] || "text/plain";
                response.writeHead(200, {
                    "Content-Type": contentType
                });
                response.write(file, "binary");
                response.end();
            }
        });
    });
    hits++;
});

server.listen(port, console.log("Server listening at port:",port));
