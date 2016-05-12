'use strict';

var app = require('../..');
import request from 'supertest';

var newDevice;

describe('Device API:', function() {

  describe('GET /api/devices', function() {
    var devices;

    beforeEach(function(done) {
      request(app)
        .get('/api/devices')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          devices = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      devices.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/devices', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/devices')
        .send({
          name: 'New Device',
          info: 'This is the brand new device!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDevice = res.body;
          done();
        });
    });

    it('should respond with the newly created device', function() {
      newDevice.name.should.equal('New Device');
      newDevice.info.should.equal('This is the brand new device!!!');
    });

  });

  describe('GET /api/devices/:id', function() {
    var device;

    beforeEach(function(done) {
      request(app)
        .get('/api/devices/' + newDevice._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          device = res.body;
          done();
        });
    });

    afterEach(function() {
      device = {};
    });

    it('should respond with the requested device', function() {
      device.name.should.equal('New Device');
      device.info.should.equal('This is the brand new device!!!');
    });

  });

  describe('PUT /api/devices/:id', function() {
    var updatedDevice;

    beforeEach(function(done) {
      request(app)
        .put('/api/devices/' + newDevice._id)
        .send({
          name: 'Updated Device',
          info: 'This is the updated device!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDevice = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDevice = {};
    });

    it('should respond with the updated device', function() {
      updatedDevice.name.should.equal('Updated Device');
      updatedDevice.info.should.equal('This is the updated device!!!');
    });

  });

  describe('DELETE /api/devices/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/devices/' + newDevice._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when device does not exist', function(done) {
      request(app)
        .delete('/api/devices/' + newDevice._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
