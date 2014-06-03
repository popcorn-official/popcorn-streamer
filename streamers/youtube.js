var inherits = require('util').inherits
  , ytdl = require('ytdl');

var Streamer = require('./base');

/* -- YouTube Streamer -- */
function YoutubeStreamer(options) {
	if(!(this instanceof YoutubeStreamer)) 
		return new YoutubeStreamer(options);
	
	Streamer.call(this, options);
	var self = this;

	var vid = ytdl('https://youtube.com/watch?v=3T2kChOed70');
	vid.on('info', function(info, format) {
		self._progress.setLength(format.size);
	})
	this._streamify.resolve(vid);
}
inherits(YoutubeStreamer, Streamer);

module.exports = YoutubeStreamer;