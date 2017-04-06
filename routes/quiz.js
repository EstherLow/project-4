const express = require('express')
const router = express.Router()
const quizzes_controller = require('../controllers/quizzes_controller')
const questions_controller = require('../controllers/questions_controller')
const livequizzes_controller = require('../controllers/livequizzes_controller')

router.get('/new', function (req, res) { res.render('quizzes/new') })

router.post('/new', quizzes_controller.addQuiz)  // add new quiz

router.get('/:id', quizzes_controller.editQuiz)  //show edit form for 1 quiz

router.put('/:id', quizzes_controller.updateQuiz)

router.get('/:id/questions/new', questions_controller.new)  // add new questions to created quiz

//router.get('/quiz/:id', quizzes_controller.showQuiz)

router.get('/:id/live', livequizzes_controller.showLiveQuiz)  // show view of individual live quiz















module.exports = router
