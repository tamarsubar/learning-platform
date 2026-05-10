const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

router.post('/ask', learningController.askQuestion);
router.get('/history/:userId', learningController.getHistory);

module.exports = router;