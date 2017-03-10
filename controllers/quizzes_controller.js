const express = require('express')
const Quiz = require('../models/quiz').model
const Question = require('../models/question').model
const Participant = require('../models/participant').model

module.exports = {
  addQuiz: function (req, res, next) {
    Quiz.create({
      name: req.body.name,
      instructions: req.body.instructions
    }, function(err, quiz) {
      if (err) { return console.log(err) }
      res.redirect('/quizzes/' + quiz._id + '/questions/new')
    })
  },
  listAllQuiz: function (req, res, next) {
    Quiz.find({}, function(err, quizzes) {
      if (err) { return console.log(err) }
      res.render('dashboard', {quizzes: quizzes})
    })
  },
  editQuiz: function (req, res, next) {
    Quiz.findById({_id: req.params.id}, function (err, quiz) {
      if (err) { return console.log(err) }
      Question.find({quiz_id: req.params.id}, function (err, questions) {
        if (err) { return console.log(err) }
        console.log(questions);
        res.render('quizzes/edit', {quiz: quiz, questions: questions})
      })
    })
  },
  updateQuiz: function (req, res, next) {
    console.log(req.body);
    let objOpt = req.body.qn_options
    let optionsArr = []  //{content: ...., isAnswer: false}, {content: ...., isAnswer: false},
    for (let i = 0; i < 4; i++) {
      if (objOpt['content'][i] !== '') {
          let tempObj = {}
          tempObj['content'] = objOpt['content'][i]
          tempObj['isAnswer'] = objOpt['isAnswer'][i]
          optionsArr.push(tempObj)
      }
    }
    Quiz.update({_id: req.params.id},
      {name: req.body.name, instructions: req.body.instructions },
      function (err, quiz) {
      if (err) { return console.log(err) }
      //for(let i = 0; i < req.)
      Question.update({_id: req.body.qn_id}, {
      qn_stem: req.body.stem,
      qn_points: req.body.points,
      options: optionsArr}, function(err, questions) {
        res.redirect('/dashboard')
        })
      })
  },
  showLiveQuiz: function (req, res, next) {
    Quiz.findById({_id: req.params.id}, function (err, quiz) {
      if (err) { return console.log(err) }
      Question.find({quiz_id: req.params.id}, function (err, questions) {
        if (err) { return console.log(err) }
        console.log(questions);
        res.render('response2', {quiz: quiz, questions: questions})
      })
    })
  },
  showLiveQuiz2: function (req, res, next) {
    Quiz.findById({_id: req.params.id}, function (err, quiz) {
      if (err) { return console.log(err) }
      Question.find({quiz_id: req.params.id}, function (err, questions) {
        if (err) { return console.log(err) }
        console.log(questions);
        res.render('game', {quiz: quiz, questions: questions})
      })
    })
  },
  showQuiz: function (req, res, next) {
    Quiz.findById({_id: req.params.id}, function (err, quiz) {
      if (err) {return console.log(err)}
      res.render('quiz', {quiz: quiz})
    })
  },
  liveQuizScoreboard: function (req, res, next) {
    Participant.find({}, function (err, participants) {
      if (err) { return console.log(err) }
      res.render('scoreboard', {participants, participants})
    })
  }
}
