const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const authHeader = req.headers.authorization;

    // AUTH CHECK
    if (!authHeader) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="NOTE if u fail the whole server going to crash lmao", charset="UTF-8"');
        return res.end('Authentication required');
    }

    fs.readFile('config.json', (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Server error: Unable to read config.');
            return;
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        const config = JSON.parse(data.toString());

        if (username !== config.username || password !== config.password) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="NOTE if u fail the whole server going to crash lmao", charset="UTF-8"');
            return res.end('Invalid credentials');
        }

        // AUTH PASSED, HANDLE REQUEST
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(body);
            });
        } else {
            fs.readFile('index.html', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Error: Unable to load the requested file.');
                    console.error('Error reading file:', err);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            });
        }
    });
});

server.listen(3000, () => {
    console.log('The server is listening on port 3000');
});