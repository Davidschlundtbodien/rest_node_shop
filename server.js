const env = require('env2')('./.env');
const http = require('http');
const app = require('./app');


const port = process.env.DB_PORT || 3000;

const server = http.createServer(app);

server.listen(port);