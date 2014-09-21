/*
 * grunt-gss-to-json
 * https://github.com/stpe/grunt-gss-to-json
 *
 * Copyright (c) 2014 Stefan Pettersson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    gss: grunt.file.readJSON('grunt-gss.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    gss_to_json: {
      dev: {
        options: {
          spreadsheetId: "1RjQ3ZX9mnWLXUb21dl6tDn5yoekc7B36XuANWiHXuhw",
          worksheetId: "od6",
          oauth : {
              email: '<%= gss.oauth.email %>',
              keyFile: '<%= gss.oauth.keyFile %>'
          },

          includeInfo: true,

          transformRow: function(row, header) {
            var rowdata = {};
            Object.keys(row).forEach(function(col) {
              var key = header[col] ? header[col].toLowerCase().replace(/[^a-z]/g, "") : col;
              rowdata[key] = row[col];
            });
            return rowdata;
          }
        },
        dest: "tmp/spreadsheet.json"
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'clean', 'gss_to_json']);

};
