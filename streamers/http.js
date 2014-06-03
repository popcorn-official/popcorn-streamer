var inherits = require('util').inherits
  , request = require('request');

var Streamer = require('./base');

/* -- HTTP Streamer -- */
function HttpStreamer(options) {
	if(!(this instanceof HttpStreamer)) 
		return new HttpStreamer(options);

	Streamer.call(this);
	var self = this;

	this.request = request.defaults({
		encoding: null
	});

	var req = this.request('http://slurm.trakt.us/images/fanart/1395.78.jpg');
	req.on('response', function(res) {
		var length = req.getHeader('content-length', res.headers);
		if(length !== undefined)
			self._progress.setLength(parseInt(length));
	})
	this._streamify.resolve(req);
}
inherits(HttpStreamer, Streamer);

module.exports = HttpStreamer;