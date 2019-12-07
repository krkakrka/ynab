const _ = require('lodash');

function getFileExtension(file) {
	return `.${_.last(file.split('.'))}`;
}

module.exports = {
  getFileExtension
};
