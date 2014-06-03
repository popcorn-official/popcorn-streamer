var inherits = require('util').inherits;

var Streamer = require('./base');

/* -- Torrent Streamer -- */
function TorrentStreamer() {
	if(!(this instanceof TorrentStreamer)) 
		return new TorrentStreamer();

	Streamer.call(this);


}
inherits(TorrentStreamer, Streamer);

module.exports = TorrentStreamer;