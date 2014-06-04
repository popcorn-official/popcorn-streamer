var inherits = require('util').inherits
  , torrentStream = require('torrent-stream')
  , readTorrent = require('read-torrent');

var Streamer = require('./base');

/* -- Torrent Streamer -- */
function TorrentStreamer(source, options) {
	if(!(this instanceof TorrentStreamer)) 
		return new TorrentStreamer(source, options);

	Streamer.call(this, options);
	var self = this;
	options = options || {};

	this._ready = false;

	readTorrent(source, function(err, torrent) {
		if(err) throw err;

		self._torrentStream = torrentStream(torrent, options.torrent);
		self._torrentStream.on('uninterested', function() { self._torrentStream.swarm.pause() });
		self._torrentStream.on('interested',   function() { self._torrentStream.swarm.resume() });

		self._torrentStream.on('ready', function() {
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
			self._ready = true;
		})
	})
}
inherits(TorrentStreamer, Streamer);

TorrentStreamer.prototype.seek = function(start, end) {
	if(this._destroyed) throw new ReferenceError('Streamer already destroyed');
	if(!this._ready) return;

	var opts = {
		start: start
	}

	if(end !== undefined) {
		opts.end = end;
	}

	this._streamify.unresolve();
	this._streamify.resolve(this.file.createReadStream(opts));
}

TorrentStreamer.prototype.destroy = function() {
	if(this._destroyed) throw new ReferenceError('Streamer already destroyed');

	this._torrentStream.destroy();
	this._streamify.unresolve();
	this._ready = false;
	this._torrentStream = null;
	this.file = null;
	this._destroyed = true;
}

module.exports = TorrentStreamer;