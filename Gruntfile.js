module.exports = function(grunt) {

  var DEBUG = false;
  var tasks = {};

  task( 'all', [ 'concat', 'uglify', 'sass', 'autoprefixer', ] );
  task( 'dev', [ tasks.all, 'watch' ] );

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),



    concat: {
      options: {
        separator: ';',
        sourceMap: true,
        sourceMapStyle: 'embed'
      },

      allScripts: {
        src: [ 'src/js/**/*.js', ],
        dest: 'temp/js/main.js',
      },
    },



    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        mangle: !DEBUG,
        beautify: DEBUG,
      },

      allScripts: {
        src: 'temp/js/**/*.js',
        dest: 'build/js/main.min.js',
      },
    },



    sass: {
      options: {
        sourcemap: 'inline',
        style: DEBUG ?
          'expanded' :
          'compressed',
      },

      allStyles: {
        expand: true,
        cwd: 'src/css',
        src: ['**/*.scss'],
        dest: 'temp/css/compiled',
        ext: '.min.css',
      },
    },



    autoprefixer: {
      options: {
        browsers: ['last 100 versions', 'ie 8', 'ie 9', ],
        map: true,
      },

      allStyles: {
        expand: true,
        flatten: true,
        src: 'temp/css/compiled/**/*.css',
        dest: 'build/css'
      },
    },



    watch: {
      styles: {
        files: [ 'src/css/**/*.scss', 'src/css/*.scss', ],
        tasks: [ 'sass', 'autoprefixer', ],
        options: {
          // Start a live reload server on the default port 35729
          livereload: true,
        },
      },

      scripts: {
        files: [ 'src/js/**/*.js', 'src/js/*.js', ],
        tasks: [ 'concat', 'uglify', ],
        options: {
          // Start another live reload server on port 1337
          livereload: true,
        },
      },
    },

  });





  //  Javascript
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //  CSS
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  //  Watch
  grunt.loadNpmTasks('grunt-contrib-watch');



  // Default task(s).
  grunt.registerTask('dev',   tasks.dev );
  grunt.registerTask('build', tasks.all );





  //  GRUNT MANIP FUNCTIONS //





  function task ( taskName, newTasks, prune ) {
    var list;

    //  If the taskName isn't a string, return an empty array
    if ( typeof taskName !== 'string' ) {
      tasks[ taskName ] = [];
    }
    //  If the newTasks isn't a string or an array, return an empty array
    if (  typeof newTasks === 'string' ) {
      newTasks = tasks[newTasks];
    }
    if (  Object.prototype.toString.call( newTasks ) !== '[object Array]' ) {
      tasks[ taskName ] = [];
    }

    list = mergeLists( [], newTasks );

    tasks[ taskName ] = prune ?
      cleanList( list ) :
      list;
  }

  function mergeLists ( list1, list2 ) {
    var i = 0;
    var listItem;

    var newList = typeof list1 === 'string' ?
      [list1] :
      list1.slice(0);

    list2 = typeof list2 === 'string' ?
      [list2] :
      list2;

    for (; i < list2.length; i+=1 ) {
      listItem = list2[i];

      if ( typeof listItem === 'string' ) {
        newList.push( listItem );

      }

      if ( Object.prototype.toString.call( listItem ) === '[object Array]' ) {
        newList = mergeLists( newList, listItem );
      }
    }

    return newList;
  }

  function cleanList ( oldList ) {
    var i = 0;
    var newList = [];
    var oldListItem;

    for (; i<oldList.length; i+=1 ) {
      oldListItem = oldList[i];

      if ( newList.indexOf( oldListItem ) <= 0 ) {
        newList.push( oldListItem );
      }
    }

    return newList;
  }

};