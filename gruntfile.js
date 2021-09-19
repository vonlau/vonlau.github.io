module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'build/<%= pkg.name %>.min.js'
        }
      },
      watch: {
        css: {
        files: 'sass/*.scss',
        tasks: ['sass'],
        options: { livereload: true }
      },
      livereload: {
        options: { livereload: true },
        files: [
            '{,*/}*.html',
            '*.html',
            'assets/images/{,*/}*',
            'assets/js/*.js'
        ]
    },
    options: {
      livereload: true,
  },

      html: {
          options: { livereload: true },
          files: ['*.html']
      },
      sass: {
          options: { livereload: true },
          files: ['sass/*.scss'],
          tasks: ['compass:dev']
      },
      options: {
        livereload: true
      },
      js: {
          options: { livereload: true },
        files: ['assets/js/*.js'],
        tasks: ['jshint']
      },
      images: {
          options: { livereload: true },
          files: ['assets/images/*.*']
      },
      fontsicons: {
          options: { livereload: true },
          files: ['assets/images/icons/**/*.{svg,eot,woff,ttf,woff2,otf}'],
          tasks: ['copy:fontsicons']
      }
  }, 
      connect: {
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                keepalive: true,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        'app'
                    ]
                }
            }
        }
    }
    });
  
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    // Default task(s).
    grunt.registerTask('default', ['uglify','connect','watch']);
  
  };