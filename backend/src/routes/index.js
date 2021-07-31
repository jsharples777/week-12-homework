const express = require('express');
const request = require('request');
const router = express.Router();
const debug = require('debug')('routes');
const ds = require("../db/DataSource");

/* GET home page. */
router.get('/', function(req, res, next) {
    debug(req.method + ' ' + req.url);
    res.render('index');
});

router.get("/ping", function(req,res) {
    debug(req.method + ' ' + req.url);
    res.status(200).send("pong!");
})


router.get("/test", (req, res) => {
    debug(req.method + ' ' + req.url);
    res.send("Hello World");
});

/*
Notes APIs
 */
router.get("/notes", (req, res) => {
    debug(req.method + ' ' + req.url);
    res.render('notes',{layout: "notes"});
});

router.get("/api/notes", (req, res) => {
    debug(req.method + ' ' + req.url);
    // send back JSON data
    let savedData = ds.getItems();
    res.json(savedData);
});

router.post("/api/notes", (req,res) => {
    debug(req.method + ' ' + req.url);
    debug(req.body);
    let {title,note} = req.body;
    let id = req.body.id;
    let noteObj = {
        title:title,
        note:note
    };
    if (id) noteObj["id"] = id;
    debug(noteObj);
    // save the note attached and return it back to the client with the new ID
    let savedData = ds.updateItem(noteObj);
    res.json(savedData);
});


router.delete("/api/notes/:id", (req,res) => {
    debug(req.method + ' ' + req.url);
    // delete the note with the id
    let id = req.params.id;
    debug(id);
    if (id) {
        ds.deleteItem(id);
    }
    res.json({id:id,result:true});
});



module.exports = router;