const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

router.post('/chat', learningController.askQuestion);
router.get('/history/:userId', learningController.getHistory);
router.get('/session/:sessionId', learningController.getSessionMessages);

module.exports = router;