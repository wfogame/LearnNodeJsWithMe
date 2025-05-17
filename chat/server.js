const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const parseUrl = url.parse(req.url);
    const parsedUrl = parseUrl.pathname;

    const auth = req.headers.authorization;

    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.end('You need Headers');
    }

    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = credentials.split(':');

    // Read users from database.json
    let users;
    try {
        const dbData = fs.readFileSync('database.json', 'utf8');
        const db = JSON.parse(dbData);
        users = db.users || [];
    } catch (e) {
        res.statusCode = 500;
        return res.end('Server error: Unable to read users');
    }

    const userMatch = users.find(u => u.username === username && u.password === password);
    if (!userMatch) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.end('You need Correct password');
    }

    // Handle POST to add chat message
    if (req.method === "POST" && req.headers['content-type'] === 'application/json') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newMsg = JSON.parse(body);
                // Ensure user is set to the authenticated user
                newMsg.user = username;
                fs.readFile('database.json', 'utf8', (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        return res.end('Error reading database');
                    }
                    let db;
                    try {
                        db = JSON.parse(data);
                    } catch (e) {
                        db = { users: [], chatMessages: [] };
                    }
                    db.chatMessages.push(newMsg);
                    fs.writeFile('database.json', JSON.stringify(db, null, 2), err => {
                        if (err) {
                            res.statusCode = 500;
                            return res.end('Error writing database');
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'ok' }));
                    });
                });
            } catch (e) {
                res.statusCode = 400;
                res.end('Invalid JSON');
            }
        });
        return;
    }

    // Serve chat messages if writeChat header is present
    if (req.headers.writechat) {
        fs.readFile('database.json', (err, data) => {
            if (err) {
                res.statusCode = 500;
                return res.end('Error reading database');
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });
        return;
    }

    // Serve static files (index.html and others)
    let filePath = parsedUrl === '/' ? 'index.html' : parsedUrl.slice(1);
    filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon'
    };
    const contentType = mimeTypes[ext] || '/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('404 Not Found');
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    });
});

server.listen(5000, () => {
    console.log("Listening on http://localhost:5000");
});