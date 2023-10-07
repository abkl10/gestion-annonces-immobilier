var express = require('express');
var router = express.Router();
var Annonce = require('../models/annonces');
const path=require('path');


const authCheck=(req, res, next)=>{
    if(!req.user){
        //7if user not log in
        res.redirect('/auth/login');
    }else{
        next();//go on of the next piece of the middleware
    }
}
router.get('/annonces', async function(req, res, next) {
    try {
        // Use the find() method to retrieve all announcements
        const announcements = await Annonce.find({publication: true});
        // Render the 'annonces' view and pass the announcements as data
        res.render('annonces', { title: 'Annonces', announcements: announcements, user:req.user });
    } catch (error) {
        console.error("Error retrieving announcements:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/myannonces', async function(req, res, next) {
    try {
        // Use the find() method to retrieve all announcements
        const announcements = await Annonce.find();
        // Render the 'annonces' view and pass the announcements as data
        res.render('myannonces', { title: 'Annonces', announcements: announcements, user:req.user });
    } catch (error) {
        console.error("Error retrieving announcements:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/create-announcement', authCheck,async function(req, res, next) {
    const announcements = await Annonce.find();
    res.render('add-announcement', { title: 'Annonces', announcements: announcements, user: req.user, showModal: true });
});

// Add a route for creating announcements
router.post('/create-announcement', async function (req, res, next) {
    try {
        console.log(req.files);
        // Extract form data from the request body
        const { titre, type, publication, status, description, prix } = req.body;
        const isPublished = publication === 'on';
        let photos = req.files.photos; // Access the photos object correctly
        console.log(photos);
        const imageDossier = __dirname + "/../public/images/";
        const photoSrc = [];
        // Create a new instance of your Annonce model with the correct form data, including photos
        if (photos) {
            if (!Array.isArray(photos)) {
                photos = [photos]; // Convert to an array if it's not already
            }
            photos.forEach((p, i) => {
                const splittedName = p.name.split(".");
                console.log(p.name + " et " + p.mv);
                const imgUrl =
                    new Date().getTime() +
                    i +
                    "." +
                    splittedName[splittedName.length - 1];
                p.mv(path.join(imageDossier, imgUrl), (err) => {
                    if (err) {
                        console.error(err);
                        // Handle the error here
                    }
                });
                photoSrc.push(imgUrl);
            });
        }

        const newAnnouncement = new Annonce({
            titre: titre,
            type: type,
            publication: isPublished,
            status: status,
            description: description,
            prix: prix,
            photos: photoSrc,
        });

        // Save the new announcement into the database
        await newAnnouncement.save();

        // Redirect back to the announcements page
        res.redirect('/ad/annonces');
    } catch (error) {
        // Handle any errors that occur during the creation of the announcement
        console.error(error);
        res.status(500).send('An error occurred while creating the announcement.');
    }
});





//delete announcement
router.get('/delete-announcement/:id', authCheck,async (req, res) => {
    const announcementId = req.params.id;
    console.log(announcementId);

    try {
        // Find the announcement by ID and delete it
        await Annonce.findByIdAndRemove(announcementId);

        // Redirect back to the announcements page after deletion
        res.redirect('/ad/annonces');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while deleting the announcement.');
    }
});

// Route to render the edit announcement page
router.get('/edit-announcement/:id', authCheck,async (req, res) => {
    const announcementId = req.params.id;

    try {
        // Find the announcement by ID
        const announcement = await Annonce.findById(announcementId);
        // Render a template to edit announcement details
        res.render('edit-announcement', { announcement:announcement, user:req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the announcement for editing.');
    }
});

// Route to handle edit-announcement
router.post('/edit-announcement/:id', async (req, res) => {
    const announcementId = req.params.id;
    const updatedAnnouncementData = req.body;

    try {
        const announcement = await Annonce.findById(announcementId);
        if (!announcement) {
            return res.status(404).send('Announcement not found');
        }

        // Update
        announcement.titre = updatedAnnouncementData.titre;
        announcement.type = updatedAnnouncementData.type;
        announcement.status = updatedAnnouncementData.status;
        announcement.description = updatedAnnouncementData.description;
        announcement.prix = updatedAnnouncementData.prix;
        announcement.publication = updatedAnnouncementData.publication === 'on';

        // Handle photos
        if (req.files && req.files.photos) {
            const imageDossier = __dirname + '/../public/images/';
            const photoSrc = [];

            if (!Array.isArray(req.files.photos)) {
                req.files.photos = [req.files.photos];
            }

            req.files.photos.forEach((p, i) => {
                const splittedName = p.name.split('.');
                const imgUrl =
                    new Date().getTime() +
                    i +
                    '.' +
                    splittedName[splittedName.length - 1];
                p.mv(path.join(imageDossier, imgUrl), (err) => {
                    if (err) {
                        console.error(err);
                        // Handle the error here
                    }
                });
                photoSrc.push(imgUrl);
            });
            announcement.photos = photoSrc;        }
        // Save the updated announcement
        await announcement.save();

        // Redirect back to the announcements page after editing
        res.redirect('/ad/annonces');
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred while editing the announcement: ${error.message}`);
    }
});



router.get('/delete-image/:announcementId', async (req, res) => {
    const announcementId = req.params.announcementId;
    const index = req.query.index;

    try {
        // Find the announcement by ID and remove the image
        const announcement = await Annonce.findById(announcementId);

        if (!announcement) {
            return res.status(404).send('Announcement not found');
        }

        if (!announcement.photos || !Array.isArray(announcement.photos) || index < 0 || index >= announcement.photos.length) {
            return res.status(404).send('Image not found in announcement');
        }

        // Delete the image from the database
        const deletedImage = announcement.photos.splice(index, 1)[0];
        await announcement.save();

        // Delete the image file from the server (optional, if you want to delete the file from your server)
        // You may need to adjust the path based on your file structure
        const imagePath = path.join(__dirname, '/images/', deletedImage);
        fs.unlinkSync(imagePath);

        // Redirect back to the announcement page or any other appropriate page
        res.redirect(`/announcement/${announcementId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred while deleting the image: ${error.message}`);
    }
});


module.exports = router;