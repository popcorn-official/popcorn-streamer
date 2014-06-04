/* File Streamer from multiple source protocols */
var URI = require('URIjs');

var HTTPStreamer = require('./streamers/http')
  , YouTubeStreamer = require('./streamers/youtube')
  , TorrentStreamer = require('./streamers/torrent')

module.exports = {
	getStreamer: function(source, type) {
		var uri = URI(source);
		if(uri.domain() === 'youtu.be' || uri.domain() === 'youtube.com' || type === 'youtube') {
			return YouTubeStreamer.bind(null, source);
		} else if(uri.protocol() === 'magnet' || uri.suffix() === 'torrent' || type === 'torrent') {
			return TorrentStreamer.bind(null, source);
		} else if(uri.protocol() === 'http' || uri.protocol() === 'https' || type === 'http') {
			return HTTPStreamer.bind(null, source);
		}
		throw new Error('Unsupported Source Type');
	}
}