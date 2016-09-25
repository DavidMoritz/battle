module.exports = function(grunt) {
	grunt.config.set('jscs', {
		src: 'src/**/*.js',
		options: {
			config: '.jscsrc',
			esnext: true
		}
	});

	grunt.loadNpmTasks('grunt-jscs');
};