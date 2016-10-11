module.exports = function exportJshint(grunt) {
	grunt.config('jshint', {
		options: {
			reporter: require('jshint-stylish'),
			jshintrc: '.jshintrc'
		},
		all: [
			'src/**/*.js',
			'grunt/**/*.js',
			'!src/html/**/*'
		]
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
};
