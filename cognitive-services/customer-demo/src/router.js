var express = require('express');
var crypto = require('crypto');
var axios = require('axios');
var util = require('./util.js');
var stringify = require('json-stringify-safe');
var router = express.Router();

router.get('/hello', function (req, res) {
    
    
    res.send("hello")

});

router.get('/bingSearchNews', function (req, res) {
        
    util.bingSearchNews(req.query.keyword,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
        console.log(error)
    })

});

router.post('/detectface', function (req, res) {
        
    util.detectface(req.body,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
        console.log(error)
    })

});

router.post('/ocr', function (req, res) {
    
    
    util.ocr(req.body,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
        console.log(error)
    })

});

router.post('/recognizeText', function (req, res) {
    
    
    util.recognizeText(req.body,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
        console.log(error)
    })

});

router.post('/textAnalyticsInKeyPhrases', function (req, res) {
    
    util.textAnalyticsInKeyPhrases(req.body,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
        console.log(error)
    })
});

router.post('/textAnalyticsInSentiment', function (req, res) {
    
    util.textAnalyticsInSentiment(req.body,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
        console.log(error)
    })
});

module.exports = router;