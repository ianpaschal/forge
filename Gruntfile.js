module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		jsdoc : {
			dist : {
				src: [ "src/**/*.js", "README.md" ],
				options: {
					"destination": "./docs/",
			    "encoding": "utf8",
			    "private": true,
			    "recurse": true,
			    "template": "./node_modules/minami"
				}
			}
		}
	});

	// Load tasks:
	grunt.loadNpmTasks( "grunt-jsdoc" );

	// Default task(s).
	grunt.registerTask( "default", [ "jsdoc" ] );

};
