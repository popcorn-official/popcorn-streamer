var inherits = require('util').inherits
  , mime = require('mime')
  , torrentStream = require('torrent-stream')
  , rangeParser = require('range-parser');

var Streamer = require('./base');

/* -- Torrent Streamer -- */
function TorrentStreamer(source, options) {
	if(!(this instanceof TorrentStreamer)) 
		return new TorrentStreamer(source, options);

	Streamer.call(this, options);
	var self = this;
	options = options || {};

	this._torrentStream = torrentStream(source, options.torrent);
	this._torrentStream.on('uninterested', function() { self._torrentStream.swarm.pause() });
	this._torrentStream.on('interested',   function() { self._torrentStream.swarm.resume() });

	this._torrentStream.on('ready', function() {
		if (typeof options.fileIndex !== 'number') {
			index = self._torrentStream.files.reduce(function(a, b) {
				return a.length > b.length ? a : b;
			});
			index = self._torrentStream.files.indexOf(index);
		}

		self._torrentStream.files[index].select();
		self.file = self._torrentStream.files[index];
		self._progress.setLength(self.file.length);
		self._streamify.resolve(self.file.createReadStream());
	})
}
inherits(TorrentStreamer, Streamer);

module.exports = TorrentStreamer;