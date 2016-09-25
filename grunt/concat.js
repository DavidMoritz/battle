/**
 * concatenate scripts together for dev
 */
module.exports = function exportConcat(grunt) {
	grunt.config.set('concat', {
		js: {
			options: {
				stripBanners: true,
				banner: '<%= banner %>',
			},
			files: {
				'<%= distPath %>lib.js': [
					'lib/jquery/dist/jquery.min.js',
					'lib/jquery-ui/jquery-ui.min.js',
					'lib/bootstrap/dist/js/bootstrap.min.js',
					'lib/lodash/dist/lodash.min.js',
					'lib/firebase/firebase.js',
					'lib/angularfire/dist/angularfire.min.js',
					'lib/angular-filter/dist/angular-filter.min.js',
					'lib/angular-bootstrap/ui-bootstrap.min.js',
					'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'lib/angular-animate/angular-animate.min.js',
					'src/html/ngDraggable.js',
					'lib/moment/min/moment.min.js',
					'lib/touch-punch/jquery.ui.touch-punch.min.js',
					'src/external/**/*.js'
				],
				'<%= distPath %>main.js': [
					'src/services/mc.js',
					'src/js/app.js',
					'src/services/*.js',
					'src/js/**/*.js'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};
