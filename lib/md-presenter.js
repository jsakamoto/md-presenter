"use strict";
var opener = require("opener");
var express = require("express");
var fs = require("fs");
var path = require("path");
function start() {
    var app = express();
    app.get('/presentation.md', respondMdContent);
    var publicDir = path.join(__dirname, '../public');
    app.use(express.static(publicDir));
    var mdFilePath = null;
    fs.readdir('.', function (err, files) {
        if (err)
            throw err;
        mdFilePath = files.filter(function (file) { return fs.statSync(file).isFile() && /.*\.md$/.test(file); })[0] || null;
        if (mdFilePath == null)
            throw new Error('markdown file not found in current directory.');
        app.use(express.static(path.dirname(mdFilePath)));
    });
    function respondMdContent(req, res) {
        if (mdFilePath != null) {
            fs.readFile(mdFilePath, 'utf8', function (err, text) {
                if (err)
                    throw err;
                res.send(text);
            });
        }
        else {
            setTimeout(function () { return respondMdContent(req, res); }, 100);
        }
    }
    app.listen(8080);
    opener('http://localhost:8080/');
}
exports.start = start;
