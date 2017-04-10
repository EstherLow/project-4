const express = require('express')
const Quiz = require('../models/quiz').model
const Question = require('../models/question').model
const Participant = require('../models/participant').model
const Livequiz = require('../models/livequiz').model

module.exports = {

  showLiveQuiz: function (req, res, next) {
    Livequiz.create({quiz_id: req.params.id}, function (err, livequiz) {
      if (err) { return console.log(err) }
      Quiz.findById({_id: req.params.id})
      .populate({
        path: 'questions',
        model: 'Question'
      })
      .exec(function (err, quiz){
        if (err) { return console.log(err)}
        console.log("livequiz", livequiz);
        res.render('response3', {livequiz: livequiz, quiz: quiz})
      })
    })
  },
  // liveQuizScoreboard: function (req, res, next) {
  //   Participant.find({}, function (err, participants) {
  //     if (err) { return console.log(err) }
  //     res.render('scoreboard', {participants, participants})
  //   })
  // },
  joinLiveQuiz: function (req, res, next) {
    res.render('quizzes/join')
  },
  loadLiveQuiz: function (req, res, next) {
    Livequiz.findOne({code: req.body.code})
    .populate({
      path: 'quiz_id',
      model: 'Quiz',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    })
    .exec(function (err, livequiz) {
      if (err) { return console.log(err)}
      console.log("livequiz", livequiz);
      res.render('response2', {livequiz: livequiz})
    })
  }

}
