const express = require('express')
const router = express.Router()
const livequizzes_controller = require('../controllers/livequizzes_controller')

router.get('/', livequizzes_controller.joinLiveQuiz)
router.post('/new', livequizzes_controller.loadLiveQuiz)


module.exports = router
