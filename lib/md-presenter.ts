// Import external modules.
import * as opener from "opener";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";

export function start(): void {

    // Setup builtin HTTP server
    let app = express();

    app.get('/presentation.md', respondMdContent);

    let publicDir = path.join(__dirname, '../public');
    app.use(express.static(publicDir));

    // Detect and read markdown file in current directory.
    let mdFilePath = null;
    fs.readdir('.', (err, files) => {
        if (err) throw err;
        mdFilePath = files.filter(file => fs.statSync(file).isFile() && /.*\.md$/.test(file))[0] || null;
        if (mdFilePath == null) throw new Error('markdown file not found in current directory.');

        // Append the directory where contains markdown content to static files resources.
        app.use(express.static(path.dirname(mdFilePath)));
    });

    function respondMdContent(req, res) {
        // console.log('[respondMdContent]');
        if (mdFilePath != null) {
            fs.readFile(mdFilePath, 'utf8', (err, text) => {
                if (err) throw err;
                res.send(text);
            })
        }
        else {
            setTimeout(() => respondMdContent(req, res), 100);
        }
    }

    // Start server and launch web browser.
    app.listen(8080);
    opener('http://localhost:8080/');
}
