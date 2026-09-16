const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { upload, uploadErrorHandler } = require('../middleware/upload');
const {
  login,
} = require('../controllers/authController');

router.post('/login', login);

// Everything below requires authentication
router.use(requireAuth);

router.get('/dashboard', require('../controllers/dashboardController').dashboard);

// Projects
const projects = require('../controllers/projectsController');
router.get('/projects', projects.listAdmin);
router.post('/projects', projects.create);
router.put('/projects/:id', projects.update);
router.delete('/projects/:id', projects.remove);

// Publications
const publications = require('../controllers/publicationsController');
router.get('/publications', publications.listAdmin);
router.post('/publications', publications.create);
router.put('/publications/:id', publications.update);
router.delete('/publications/:id', publications.remove);

// Experiences
const experiences = require('../controllers/experiencesController');
router.get('/experiences', experiences.listAdmin);
router.post('/experiences', experiences.create);
router.put('/experiences/:id', experiences.update);
router.delete('/experiences/:id', experiences.remove);

// Education
const education = require('../controllers/educationController');
router.get('/education', education.listAdmin);
router.post('/education', education.create);
router.put('/education/:id', education.update);
router.delete('/education/:id', education.remove);

// Skills
const skills = require('../controllers/skillsController');
router.get('/skills', skills.listAdmin);
router.post('/skill-categories', skills.createCategory);
router.put('/skill-categories/:id', skills.updateCategory);
router.delete('/skill-categories/:id', skills.removeCategory);
router.post('/skills', skills.createSkill);
router.put('/skills/:id', skills.updateSkill);
router.delete('/skills/:id', skills.removeSkill);

// Events
const events = require('../controllers/eventsController');
router.get('/events', events.listAdmin);
router.post('/events', events.create);
router.put('/events/:id', events.update);
router.delete('/events/:id', events.remove);

// Teaching
const teaching = require('../controllers/teachingController');
router.get('/teaching', teaching.listAdmin);
router.post('/teaching', teaching.create);
router.put('/teaching/:id', teaching.update);
router.delete('/teaching/:id', teaching.remove);

// Certifications
const certifications = require('../controllers/certificationsController');
router.get('/certifications', certifications.listAdmin);
router.post('/certifications', certifications.create);
router.put('/certifications/:id', certifications.update);
router.delete('/certifications/:id', certifications.remove);

// Contact messages
const contact = require('../controllers/contactController');
router.get('/messages', contact.listAdmin);
router.put('/messages/:id/read', contact.markRead);
router.put('/messages/:id/unread', contact.markUnread);
router.delete('/messages/:id', contact.remove);

// Settings
const settings = require('../controllers/settingsController');
router.get('/settings', settings.getSettings);
router.put('/settings', settings.updateSettings);

// Social links
const social = require('../controllers/socialLinksController');
router.get('/social-links', social.listAdmin);
router.post('/social-links', social.create);
router.put('/social-links/:id', social.update);
router.delete('/social-links/:id', social.remove);

// Uploads
const uploadController = require('../controllers/uploadController');
router.post('/upload/:subdir', upload.single('file'), uploadController.uploadFile);
router.delete('/file', uploadController.deleteFile);

router.use(uploadErrorHandler);

module.exports = router;