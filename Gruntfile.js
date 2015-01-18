module.exports = function(grunt) {
  var tasks = {};
  var aTask;





//                    888    888    d8b
//                    888    888    Y8P
//                    888    888
//  .d8888b   .d88b.  888888 888888 888 88888b.   .d88b.  .d8888b
//  88K      d8P  Y8b 888    888    888 888 "88b d88P"88b 88K
//  "Y8888b. 88888888 888    888    888 888  888 888  888 "Y8888b.
//       X88 Y8b.     Y88b.  Y88b.  888 888  888 Y88b 888      X88
//   88888P'  "Y8888   "Y888  "Y888 888 888  888  "Y88888  88888P'
//                                                    888
//                                               Y8b d88P
//                                                "Y88P"
  var DEBUG = false;

  task
    ('all',
      [ 'concat', 'uglify', 'sass', 'autoprefixer', 'copy' ])

    ('build',
      'all')

    ('dev',
      [ tasks.all, 'watch' ]);









//  d8b          d8b 888
//  Y8P          Y8P 888
//                   888
//  888 88888b.  888 888888
//  888 888 "88b 888 888
//  888 888  888 888 888
//  888 888  888 888 Y88b.
//  888 888  888 888  "Y888

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),


//                                              888
//                                              888
//                                              888
//   .d8888b .d88b.  88888b.   .d8888b  8888b.  888888
//  d88P"   d88""88b 888 "88b d88P"        "88b 888
//  888     888  888 888  888 888      .d888888 888
//  Y88b.   Y88..88P 888  888 Y88b.    888  888 Y88b.
//   "Y8888P "Y88P"  888  888  "Y8888P "Y888888  "Y888

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



//                    888 d8b  .d888
//                    888 Y8P d88P"
//                    888     888
//  888  888  .d88b.  888 888 888888 888  888
//  888  888 d88P"88b 888 888 888    888  888
//  888  888 888  888 888 888 888    888  888
//  Y88b 888 Y88b 888 888 888 888    Y88b 888
//   "Y88888  "Y88888 888 888 888     "Y88888
//                888                     888
//           Y8b d88P                Y8b d88P
//            "Y88P"                  "Y88P"
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



//  .d8888b   8888b.  .d8888b  .d8888b
//  88K          "88b 88K      88K
//  "Y8888b. .d888888 "Y8888b. "Y8888b.
//       X88 888  888      X88      X88
//   88888P' "Y888888  88888P'  88888P'

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



//                    888                                      .d888 d8b
//                    888                                     d88P"  Y8P
//                    888                                     888
//   8888b.  888  888 888888 .d88b.  88888b.  888d888 .d88b.  888888 888 888  888  .d88b.  888d888
//      "88b 888  888 888   d88""88b 888 "88b 888P"  d8P  Y8b 888    888 `Y8bd8P' d8P  Y8b 888P"
//  .d888888 888  888 888   888  888 888  888 888    88888888 888    888   X88K   88888888 888
//  888  888 Y88b 888 Y88b. Y88..88P 888 d88P 888    Y8b.     888    888 .d8""8b. Y8b.     888
//  "Y888888  "Y88888  "Y888 "Y88P"  88888P"  888     "Y8888  888    888 888  888  "Y8888  888
//                                   888
//                                   888
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



//   .d8888b .d88b.  88888b.  888  888
//  d88P"   d88""88b 888 "88b 888  888
//  888     888  888 888  888 888  888
//  Y88b.   Y88..88P 888 d88P Y88b 888
//   "Y8888P "Y88P"  88888P"   "Y88888
//                   888           888
//                   888      Y8b d88P
//                   888       "Y88P"
    copy: {
      main: {
        expand: true,

        cwd: 'build/',
        src: '**/*.*',
        dest: 'site/',
      },

      minecraftskinner: {
        expand: true,

        cwd: 'bower_components/brkjrdn-minecraftskinner/site',
        src: '**/*',
        dest: 'site/projects/minecraftskinner',
      },
    },


//                         888            888
//                         888            888
//                         888            888
//  888  888  888  8888b.  888888 .d8888b 88888b.
//  888  888  888     "88b 888   d88P"    888 "88b
//  888  888  888 .d888888 888   888      888  888
//  Y88b 888 d88P 888  888 Y88b. Y88b.    888  888
//   "Y8888888P"  "Y888888  "Y888 "Y8888P 888  888

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









//  888                        888
//  888                        888
//  888                        888
//  888  .d88b.   8888b.   .d88888
//  888 d88""88b     "88b d88" 888
//  888 888  888 .d888888 888  888
//  888 Y88..88P 888  888 Y88b 888
//  888  "Y88P"  "Y888888  "Y88888

  //  Javascript
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //  CSS
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  //  Move stuff
  grunt.loadNpmTasks('grunt-contrib-copy');

  //  Watch
  grunt.loadNpmTasks('grunt-contrib-watch');



//                           d8b          888
//                           Y8P          888
//                                        888
//  888d888 .d88b.   .d88b.  888 .d8888b  888888 .d88b.  888d888
//  888P"  d8P  Y8b d88P"88b 888 88K      888   d8P  Y8b 888P"
//  888    88888888 888  888 888 "Y8888b. 888   88888888 888
//  888    Y8b.     Y88b 888 888      X88 Y88b. Y8b.     888
//  888     "Y8888   "Y88888 888  88888P'  "Y888 "Y8888  888
//                       888
//                  Y8b d88P
//                   "Y88P"
  for ( aTask in tasks ) {
    grunt.registerTask( aTask, tasks[ aTask ] );
  }







  //  GRUNT MANIP FUNCTIONS //

  function task ( taskName, newTasks, prune ) {
    var list;

    //  If the taskName isn't a string, return an empty array
    if ( typeof taskName !== 'string' ) {
      tasks[ taskName ] = [];
    }
    //  If the newTasks isn't a string or an array, return an empty array
    if (  typeof newTasks === 'string' ) {
      newTasks = tasks[ newTasks ];
    }
    if (  Object.prototype.toString.call( newTasks ) !== '[object Array]' ) {
      tasks[ taskName ] = [];
    }

    list = mergeLists( [], newTasks );

    tasks[ taskName ] = prune ?
      cleanList( list ) :
      list;

    return task;
  }

  function mergeLists ( list1, list2 ) {
    var i = 0;
    var listItem;

    if ( typeof list1 === 'string' || typeof list1 === 'number' ) {
      list1 = [list1];
    } else if ( Object.prototype.toString.call( list1 ) === '[object Array]' ) {
      list1 = list1.slice(0);
    } else {
      throw( '"List" needs to be a String or an Array. Recieved: ' + typeof list1 );
    }

    if ( typeof list2 === 'string' || typeof list2 === 'number' ) {
      list2 = [list2];
    } else if ( Object.prototype.toString.call( list2 ) === '[object Array]' ) {
      list2 = list2.slice(0);
    } else {
      throw( '"List" needs to be a String or an Array. Recieved: ' + typeof list2 );
    }

    for (; i < list2.length; i+=1 ) {
      listItem = list2[i];

      if ( typeof listItem === 'string' || typeof listItem === 'number' ) {
        list1.push( '' + listItem );

      } else if ( Object.prototype.toString.call( listItem ) === '[object Array]' ) {
        list1 = mergeLists( list1, listItem );
      }

    }

    return list1;
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