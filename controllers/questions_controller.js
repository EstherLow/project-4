const express = require('express')
const Question = require('../models/question').model
const Quiz = require('../models/quiz').model

module.exports = {
  new: function (req, res, next) {
        res.render('questions/new', {req: req})
        },
  createQuestion: function (req, res, next) {
    let objOpt = req.body.options
    let optionsArr = []  //{content: ...., isAnswer: false}, {content: ...., isAnswer: false},
    for (let i = 0; i < 4; i++) {
      if (objOpt['content'][i] !== '') {
          let tempObj = {}
          tempObj['content'] = objOpt['content'][i]
          tempObj['isAnswer'] = objOpt['isAnswer'][i]
          console.log(tempObj);
          optionsArr.push(tempObj)
      }
    }
    console.log(optionsArr);
    Question.create({
      qn_type: req.body.qn_type,
      stem: req.body.stem,
      points: req.body.points,
      quiz_id: req.body.quiz_id,
      options: optionsArr
      }, function (err, question) {
        if (err) { return console.log(err) }
        let quizID = req.body.quiz_id
        if (!req.body.quiz_id) { quizID = req.params.id}
        Quiz.findById({_id: quizID}, function (err, quiz) {
          console.log('quiz.questions', quiz.questions);
          quiz.questions.push(question._id)
          quiz.save()
          if (err) { return console.log(err) }
          if (req.body.destination === "Save and Exit") {
            console.log(req.body);
            res.redirect('/')
          } else if (req.body.destination === "Save and Add Question") {
            res.redirect('/quiz/' + req.body.quiz_id +'/question/new')
          }
        })
    })
  }
}
