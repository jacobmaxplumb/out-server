const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    let filePath;

    if (parsedUrl.pathname === '/') {
        filePath = './index.html';
    } else if (parsedUrl.pathname === '/about') {
        filePath = './about.html';
    } else if (parsedUrl.pathname === '/data') {
        if (method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const data = JSON.stringify({ message: 'Hello, World!' });
            res.end(data);
            return;
        } else if (method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const parsedData = JSON.parse(body);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ received: parsedData }));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Invalid JSON');
                }
            });
            return;
        }
    }

    if (filePath) {
        const fileExt = path.extname(filePath);
        let contentType = 'text/plain';

        switch (fileExt) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            default:
                break;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});