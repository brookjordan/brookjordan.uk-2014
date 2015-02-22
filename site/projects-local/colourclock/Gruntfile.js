module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),



		processhtml: {
			options: {},

			dist: {
				files: {
					'colourclock/nonmin.html': ['index.html', ],
				},
			},
		},



		htmlmin: {
			options: {
				removeComments: true,
				//removeCommentsFromCDATA: false,
				//removeCDATASectionsFromCDATA: false,
				collapseWhitespace: true,
				conservativeCollapse: false,
				preserveLineBreaks: false,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true,
				//preventAttributesEscaping: false,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				removeOptionalTags: true,
				removeIgnored: true,
				removeEmptyElements: false,
				lint: false,
				keepClosingSlash: false,
				caseSensitive: false,
				minifyJS: true, // (could be true, false, Object (options))
				minifyCSS: true,  //(could be true, false, Object (options))
				minifyURLs: false, // (could be Object (options)),
				//ignoreCustomComments: [ ],
				//processScripts: [ ],
				//maxLineLength: , // Specify a maximum line length. Compressed output will be split by newlines at valid HTML split-points.
				//customAttrAssign: [ ],
				//customAttrSurround: [ ],
				//customAttrCollapse: Regex that specifies custom attribute to strip newlines from (e.g. /ng\-class/),
			},

			dist: {
				files: {
					'colourclock/index.html': 'colourclock/nonmin.html',
				},
			},
		},



		cssUrlEmbed: {
			encodeDirectly: {
				files: {
					'colourclock/index.html': ['colourclock/index.html', ],
				},
			},
		},



		watch: {
			options: {
				spawn: false,
			},

			scripts: {
				files: [ '**/*.html', '**/*.css', '**/*.js' ],
				tasks: [ 'processhtml', 'htmlmin', 'cssUrlEmbed', ],
			},
		},

	});


	require('load-grunt-tasks')(grunt);

	// Default task(s).
	grunt.registerTask('default', [ 'processhtml', 'htmlmin', 'cssUrlEmbed', 'watch', ]);

};