module.exports = function(grunt) {
	grunt.config.set('jscs', {
		src: [
			'src/**/*.js',
			'!src/html/**/*.js'
		],
		options: {
			config: '.jscsrc',
			fix: true
		}
	});

	grunt.loadNpmTasks('grunt-jscs');
};