const express = require('express')
const request = require('request')
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
      res.redirect('/quiz/' + quiz._id + '/question/new')
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
  showQuiz: function (req, res, next) {
    Quiz.findById({_id: req.params.id}, function (err, quiz) {
      if (err) {return console.log(err)}
      res.render('quiz', {quiz: quiz})
    })
  },
  getOpenTrivia: function (req, res, next) {
    request("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple", function (error, response) {
      if (error) { return console.log(error)}
      let data = JSON.parse(response.body)
      let results = data.results
      let quizTrivia = []
      results.forEach(function (result) {
        let qnHolder = {}
        qnHolder.stem = result.question
        qnHolder.options = []
        result.correct_answer = {'content': result.correct_answer, 'isAnswer': true}
        let optionsHolder = qnHolder.options
        let incorrectAnswers = result.incorrect_answers
        incorrectAnswers.forEach(function (answer) {
          let temp = {}
          temp.content = answer
          temp.istrue = false
          optionsHolder.push(temp)
        })
        optionsHolder.push(result.correct_answer)
        quizTrivia.push(qnHolder)
        console.log('questionholder', qnHolder);
      })
        res.render('opentrivia', {quizTrivia: quizTrivia})

    })
  }
}
