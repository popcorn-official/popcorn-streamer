var inherits = require('util').inherits
  , extend = require('extend')
  , PassThrough = require('stream').PassThrough
  , streamify = require('streamify')
  , progressStream = require('progress-stream');

/* -- Base Streamer -- */
function Streamer(options) {
	var self = this;

	options = options || {};
	var progressOptions = {
		// Hack to allow people to pass the default in for time
		time: (options.progressInterval === -1 ? undefined : options.progressInterval) || 1000,
		speed: options.speedDelay || 5000 
	}

	PassThrough.call(this);

	this._destroyed = false;

	this.downloaded = 0;
	this.progress = 0;
	this.downloadSpeed = 0;
	this.eta = Infinity;

	this._streamify = streamify(options.streamify);
	this._progress = progressStream(progressOptions);

	this._progress.on('progress', function(progress) {
		self.downloaded = progress.transferred;
		self.progress = progress.percentage;
		self.downloadSpeed = progress.speed;
		self.eta = progress.eta || Infinity;

		self.emit('progress', {
			downloaded: progress.transferred,
			progress: progress.percentage,
			downloadSpeed: progress.speed,
			eta: progress.eta || Infinity
		})
	})

	this._streamify.pipe(this._progress).pipe(this);
}
inherits(Streamer, PassThrough);

Streamer.prototype.seek = function(start, end) {
	// Virtual function, implemented in child
}

Streamer.prototype.destroy = function() {
	// Virtual function, implemented in child
}

module.exports = Streamer;