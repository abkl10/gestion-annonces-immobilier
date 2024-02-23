const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app
const expect = chai.expect;
const mongoose = require('mongoose');


chai.use(chaiHttp);

describe('Routes', () => {
  // Assuming you have user authentication set up for testing, you can create a user session for testing

  // Mock user session, you may need to customize this based on your authentication logic
  let authenticatedUser = chai.request.agent(app);
const mongoTestUrl = 'mongodb://localhost:27017/'; // Replace with your test database URL


  // Before running the tests, login as a user
    before(async () => {
        try {
            // Connect to the MongoDB test database
            await mongoose.connect(mongoTestUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to the MongoDB test database.');

            // Create a test user session or log in as a user (if authentication is required)
            authenticatedUser = chai.request.agent(app);

            // Log in as a user (if needed for authentication)
            await authenticatedUser
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });
        } catch (error) {
            console.error('Error connecting to the MongoDB test database:', error);
        }
    });

    after(async () => {
        // Close the authenticated user session (if logged in)
        if (authenticatedUser) {
            await authenticatedUser.get('/auth/logout');
        }

        // Disconnect from the MongoDB test database
        await mongoose.connection.close();
        console.log('Disconnected from the MongoDB test database.');
    });


    it('should render the /read/:id route', (done) => {
        // Replace 'validAnnouncementId' with a valid announcement ID from your test database
        const validAnnouncementId = '65229cdfd5fa02b464e9f181';

        authenticatedUser
            .get(`/ad/read/${validAnnouncementId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should handle a request with an invalid announcement ID', (done) => {
        // Provide an invalid announcement ID that does not exist in the database
        const invalidAnnouncementId = 'invalidAnnouncementId';

        authenticatedUser
            .get(`/ad/read/${invalidAnnouncementId}`)
            .end((err, res) => {
                    expect(res).to.have.status(500);
                // Add assertions to check for error messages or validation errors in the response
                done();
            });
    });

  it('should render the /annonces route', (done) => {
    authenticatedUser
      .get('/ad/annonces')
      .end((err, res) => {
        expect(res).to.have.status(200);
        // Add more assertions to check the content of the 'annonces' page
        done();
      });
  });

  it('should render the /create-announcement route', (done) => {
    authenticatedUser
      .get('/ad/create-announcement')
      .end((err, res) => {
        expect(res).to.have.status(200);
        // Add more assertions to check the content of the 'create-announcement' page
        done();
      });
  });

    it('should successfully create an announcement without file uploads', async (done) => {
        // Define the announcement data you're going to create
        const announcementData = {
            titre: 'New Announcement',
            type: 'vente',
            publication: 'on',
            status: 'Disponible',
            description: 'A new announcement',
            prix: '100',
            photos: '',
        };

        // Perform the POST request to create the announcement
        authenticatedUser
            .post('/ad/create-announcement')
            .send(announcementData)
            .end(async (err, res) => {
                try {
                    // Expect a redirect upon successful creation
                    expect(res).to.have.status(302);

                    // Query the database to check if the announcement was created
                    const createdAnnouncement = await Annonce.findOne({ titre: announcementData.titre });

                    // Expect the createdAnnouncement to exist and have the expected data
                    expect(createdAnnouncement).to.exist;
                    expect(createdAnnouncement.titre).to.equal(announcementData.titre);
                    expect(createdAnnouncement.type).to.equal(announcementData.type);
                    expect(createdAnnouncement.status).to.equal(announcementData.status);
                    expect(createdAnnouncement.description).to.equal(announcementData.description);
                    expect(createdAnnouncement.prix).to.equal(announcementData.prix);
                    expect(createdAnnouncement.photos).to.deep.equal(announcementData.photos);

                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

  
  it('should render a single announcement page', (done) => {
    // Replace 'validAnnouncementId' with a valid announcement ID from your test database
    const validAnnouncementId = '65229cdfd5fa02b464e9f181';
  
    authenticatedUser
      .get(`/ad/read/${validAnnouncementId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  



  it('should fail to create an announcement with invalid data', (done) => {
    authenticatedUser
      .post('/ad/create-announcement')
      .field('titre', '') // Invalid: Empty title
      .end((err, res) => {
        expect(res).to.have.status(500); // Assuming it returns a 500 status code for validation failure
        // Add assertions to check for error messages or validation errors in the response
        done();
      });
  });


  it('should fail to delete an announcement with an invalid ID', (done) => {
    // Provide an invalid announcement ID that does not exist in the database
    const invalidAnnouncementId = '0000000';

    authenticatedUser
      .get(`/ad/delete-announcement/${invalidAnnouncementId}`)
      .end((err, res) => {
        expect(res).to.have.status(500); // Assuming it returns a 404 status code for not found
        // Add assertions to check for error messages or validation errors in the response
        done();
      });
  });

  // Add more tests for other routes and scenarios as needed
});
