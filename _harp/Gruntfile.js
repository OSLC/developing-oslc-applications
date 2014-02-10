module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
      autoprefixer: {
        options: {
          // Task-specific options go here.
        },
        multiple_files: {
          expand: true,
          flatten: true,
          src: 'css/*.css',
          dest: 'css/autoprefixed/'
        },
      },
      
      watch: {
        styles: {
          files: 'css/*.css',
          tasks: ['autoprefixer']
        }
      }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['autoprefixer']);

};