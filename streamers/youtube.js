var inherits = require('util').inherits
  , ytdl = require('ytdl');

var Streamer = require('./base');

/* -- YouTube Streamer -- */
function YoutubeStreamer(source, options) {
	if(!(this instanceof YoutubeStreamer)) 
		return new YoutubeStreamer(source, options);

	Streamer.call(this, options);
	var self = this;

	var vid = ytdl(source, {quality: options.hd ? 22 : 18});
	vid.on('info', function(info, format) {
		self._progress.setLength(format.size);
	})
	this._streamify.resolve(vid);
}
inherits(YoutubeStreamer, Streamer);

module.exports = YoutubeStreamer;