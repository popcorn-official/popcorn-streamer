var streamify = require('streamify');

module.exports = function(options) {
	var _strmfy = streamify(options);
	return _strmfy.constructor;
}