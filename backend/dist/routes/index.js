var express = require('express');

var request = require('request');

var router = express.Router();

var debug = require('debug')('routes');

var ds = require("../db/DataSource");
/* GET home page. */


router.get('/', function (req, res, next) {
  debug(req.method + ' ' + req.url);
  res.render('index');
});
router.get("/ping", function (req, res) {
  debug(req.method + ' ' + req.url);
  res.status(200).send("pong!");
});
router.get("/test", function (req, res) {
  debug(req.method + ' ' + req.url);
  res.send("Hello World");
});
/*
Notes APIs
 */

router.get("/notes", function (req, res) {
  debug(req.method + ' ' + req.url);
  res.render('notes', {
    layout: "notes"
  });
});
router.get("/api/notes", function (req, res) {
  debug(req.method + ' ' + req.url); // send back JSON data

  var savedData = ds.getItems();
  res.json(savedData);
});
router.post("/api/notes", function (req, res) {
  debug(req.method + ' ' + req.url);
  debug(req.body);
  var _req$body = req.body,
      title = _req$body.title,
      note = _req$body.note;
  var id = req.body.id;
  var noteObj = {
    title: title,
    note: note
  };
  if (id) noteObj["id"] = id;
  debug(noteObj); // save the note attached and return it back to the client with the new ID

  var savedData = ds.updateItem(noteObj);
  res.json(savedData);
});
router.delete("/api/notes/:id", function (req, res) {
  debug(req.method + ' ' + req.url); // delete the note with the id

  var id = req.params.id;
  debug(id);

  if (id) {
    ds.deleteItem(id);
  }

  res.json({
    id: id,
    result: true
  });
});
module.exports = router;