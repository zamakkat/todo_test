module.exports = function(grunt) {
  // Configure Grunt
  grunt.initConfig({
    /**
     * Get package meta data
     */
    pkg: grunt.file.readJSON('package.json'),

    // Setting up Sass
    sass: {
      dev: {
        files: {
          'stylesheets/style.css': 'stylesheets/style.scss'
        }
      }
    },

    // Adding a watch task
    watch: {
      sass: {
        files: 'stylesheets/*.scss',
        tasks: 'sass:dev'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
};