const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        serveStaticFile(res, 'index.html');
    } else if (url === '/about') {
        serveStaticFile(res, 'about.html');
    } else if (url === '/data' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const data = JSON.stringify({ message: 'Hello, World!' });
        res.end(data);
    } else if (url === '/data' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsedData = JSON.parse(body);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ received: parsedData }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

function serveStaticFile(res, filename) {
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});