const http = require('http');

const testLogin = () => {
    const data = JSON.stringify({
        email: 'fanyanwu83@gmail.com',
        password: 'admin123'
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        console.log('Status Code:', res.statusCode);

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            console.log('Body:', body);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
};

testLogin();
