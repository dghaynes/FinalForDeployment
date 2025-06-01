const { Router } = require('express');
const router = Router();

router.use('/chat', require('./llm')); // Adjust the path as needed
router.use('/user', require('./user'));

module.exports = router;
