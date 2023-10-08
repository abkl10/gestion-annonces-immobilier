const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app
const passportStub = require('passport-stub'); // Passport-stub for testing
const mongoose = require('mongoose');

chai.use(chaiHttp);
const expect = chai.expect;

// Initialize passportStub to work with passport
passportStub.install(app);

// Define the MongoDB test database URL
const mongoTestUrl = 'mongodb://localhost:27017/'; // Replace with your test database URL

describe('Authentication Routes', () => {
  // Connect to the test database before running tests
  before(async () => {
    try {
      // Connect to the MongoDB test database
      await mongoose.connect(mongoTestUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to the MongoDB test database.');
    } catch (error) {
      console.error('Error connecting to the MongoDB test database:', error);
    }
    
    // Simulate user login
    passportStub.login({ username: 'admin', password: 'admin' });
  });

  // Disconnect from the test database after running tests
  after(async () => {
    try {
      // Disconnect from the MongoDB test database
      await mongoose.disconnect();
      console.log('Disconnected from the MongoDB test database.');
    } catch (error) {
      console.error('Error disconnecting from the MongoDB test database:', error);
    }
    
    // Simulate user logout
    passportStub.logout();
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
  // it('should successfully log in with valid credentials', async () => {
  //   const res = await chai
  //     .request(app)
  //     .post('/auth/login')
  //     .send({ username: 'test', password: 'test' });
  
  //   expect(res).to.redirect; // Ensure a redirect
  //   expect(res).to.redirectTo('/'); // Ensure a redirect to the home page
  // });
  
  

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
