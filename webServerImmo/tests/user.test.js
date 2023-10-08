const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app
const passportStub = require('passport-stub'); // Passport-stub for testing
var express = require('express');
const mongoose = require('mongoose');

chai.use(chaiHttp);
const expect = chai.expect;

// Initialize passportStub to work with passport
passportStub.install(app);

describe('Authentication Routes', () => {
  before(() => {
    passportStub.login({ username: 'test', password: 'test' }); // Simulate user login
  });

  after(() => {
    passportStub.logout(); // Simulate user logout
  });

  it('should render login page', (done) => {
    chai
      .request(app)
      .get('/auth/login')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('login'); // Check if 'Login' is present in the response text
        done();
      });
  });
  
  it('should render signup page', (done) => {
    chai
      .request(app)
      .get('/auth/signup')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('Register'); // Ensure the page contains 'Register'
        done();
      });
  });



  // Add more tests for other routes as needed
});
