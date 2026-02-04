const request = require('supertest');
const app = require('./app');

describe('App Tests', function() {
    it('should handle undefined variable error', function(done) {
        request(app)
            .get('/undefined')
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('should handle promise error', function(done) {
        request(app)
            .get('/promise')
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
