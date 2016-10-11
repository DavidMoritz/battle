module.exports = function(grunt) {
	grunt.config.set('jscs', {
		src: [
			'src/**/*.js',
			'!src/html/**/*.js'
		],
		options: {
			config: '.jscsrc'
		}
	});

	grunt.loadNpmTasks('grunt-jscs');
};