var inherits = require('util').inherits
  , request = require('request');

var Streamer = require('./base');

/* -- HTTP Streamer -- */
function HttpStreamer(source, options) {
	if(!(this instanceof HttpStreamer)) 
		return new HttpStreamer(source, options);

	Streamer.call(this, options);
	var self = this;

	this.request = request.defaults({
		encoding: null
	});

	var req = this.request(source);
	req.on('response', function(res) {
		var length = req.getHeader('content-length', res.headers);
		if(length !== undefined)
			self._progress.setLength(parseInt(length));
	})
	this._streamify.resolve(req);
}
inherits(HttpStreamer, Streamer);

module.exports = HttpStreamer;