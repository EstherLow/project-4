const express = require('express')
const router = express.Router()
const questions_controller = require('../controllers/questions_controller')

//router.get('/:id/questions/new', questions_controller.new)  // add new questions to created quiz

router.get('/new', questions_controller.new)
router.post('/new', questions_controller.createQuestion)


module.exports = router
