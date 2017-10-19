const request = require('supertest');
const app = require('./app');

request(app)
    .get('/undefined')
    .expect(500)
    .end(function (err, res) {
    });

request(app)
    .get('/promise')
    .expect(500)
    .end(function (err, res) {
    });
