var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Server;

module.exports = new Db(settings.db, new Connection(settings.host, settings.port), {safe: true});