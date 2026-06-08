const express = require('express');
const cvController = require('../controllers/cv_controller');

const router = express.Router();

router.get('/', cvController.landing);
router.get('/start', cvController.start);
router.post('/start', cvController.lookupApplicant);
router.get('/dashboard', cvController.dashboard);
router.get('/cv/new', cvController.showForm);
router.post('/cv', cvController.create);
router.get('/cv/:id', cvController.preview);
router.post('/cv/:id/save-edits', cvController.saveEdits);
router.post('/cv/:id/export', cvController.exportDocx);

module.exports = router;
