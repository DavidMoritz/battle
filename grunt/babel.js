module.exports = function exportJade(grunt) {
	grunt.config('babel', {
		options: {
			minified: true,
			presets: ['es2015']
		},
		dist: {
			files: {
				'dist/inc/main.js': 'dist/inc/main.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-babel');
};