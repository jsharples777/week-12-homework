function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

var _require2 = require("../util/Logger"),
    Logger = _require2.Logger;

var MongoDataSource = /*#__PURE__*/function () {
  function MongoDataSource() {}

  var _proto = MongoDataSource.prototype;

  _proto.initialise = /*#__PURE__*/function () {
    var _initialise = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var url;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = process.env.PATIENT_STAGING_DB_URL;
              this.client = new MongoClient(url, {
                useUnifiedTopology: true
              });
              _context.next = 4;
              return this.client.connect();

            case 4:
              Logger.log("Mongo DB connected", 6);
              this.db = this.client.db();
              return _context.abrupt("return", this.db);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function initialise() {
      return _initialise.apply(this, arguments);
    }

    return initialise;
  }();

  _proto.getNextId = /*#__PURE__*/function () {
    var _getNextId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
      var result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              Logger.log("Getting next id with name " + name);
              Logger.log("Getting next id with name " + name);
              _context2.next = 4;
              return this.db.collection(process.env.DB_ITEM_IDS).findOneAndUpdate({
                _id: name
              }, {
                $inc: {
                  current: 1
                }
              }, {
                returnOriginal: false
              });

            case 4:
              result = _context2.sent;
              Logger.log(result.value.current, 7);
              return _context2.abrupt("return", result.value.current);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getNextId(_x) {
      return _getNextId.apply(this, arguments);
    }

    return getNextId;
  }();

  _proto.getPatientSearchDetails = /*#__PURE__*/function () {
    var _getPatientSearchDetails = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var projection, results;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              Logger.log("MongoDS: Getting Patient Search Details", 100);
              projection = {
                projection: {
                  _id: 1,
                  identifiers: {
                    legacyId: 1
                  },
                  name: {
                    firstname: 1,
                    surname: 1
                  },
                  flags: {
                    isInactive: 1,
                    hasWarnings: 1
                  }
                }
              };
              _context3.next = 4;
              return this.db.collection(process.env.DB_COLLECTION_PATIENTS).find({}, projection).toArray();

            case 4:
              results = _context3.sent;
              Logger.log(results.length, 100);
              return _context3.abrupt("return", results);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getPatientSearchDetails() {
      return _getPatientSearchDetails.apply(this, arguments);
    }

    return getPatientSearchDetails;
  }();

  _proto.getPatientById = /*#__PURE__*/function () {
    var _getPatientById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
      var projection, results;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              Logger.log("MongoDS: Getting Patient by id " + id, 100);
              projection = {
                projection: {
                  _id: 1,
                  identifiers: {
                    legacyId: 1
                  },
                  name: {
                    firstname: 1,
                    surname: 1
                  },
                  flags: {
                    isInactive: 1,
                    hasWarnings: 1
                  }
                }
              };
              _context4.next = 4;
              return this.db.collection(process.env.DB_COLLECTION_PATIENTS).findOne({
                _id: id
              });

            case 4:
              results = _context4.sent;
              Logger.log(results, 100);
              return _context4.abrupt("return", results);

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getPatientById(_x2) {
      return _getPatientById.apply(this, arguments);
    }

    return getPatientById;
  }();

  return MongoDataSource;
}();

module.exports = {
  MongoDataSource: MongoDataSource
};