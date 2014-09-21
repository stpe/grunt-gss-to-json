/*
 * grunt-gss-to-json
 * https://github.com/stpe/grunt-gss-to-json
 *
 * Copyright (c) 2014 Stefan Pettersson
 * Licensed under the MIT license.
 */

'use strict';

var Spreadsheet = require('edit-google-spreadsheet');
var extend = require('util')._extend;

module.exports = function(grunt) {

  grunt.registerMultiTask('gss_to_json', 'Read Google Spreadsheet and save as JSON.', function() {
    var options = this.options({
      debug: false,
      prettify: true,
      includeInfo: true,
      headerIsFirstRow: true
    });

    var done = this.async();

    var filename = this.files.pop().dest;

    if (!options.worksheetName && !options.worksheetId) {
      grunt.log.warn("Worksheet name or id must be specified.");
    }

    if (!options.spreadsheetName && !options.spreadsheetId) {
      grunt.log.warn("Spreadsheet name or id must be specified.");
    }

    Spreadsheet.load(
      options,
      function sheetReady(err, spreadsheet) {
        if (err) {
            return done(new Error(err));
        }

        spreadsheet.receive(function(err, rows, info) {
            if (err) {
                return done(new Error(err));
            }

            if (!options.spreadsheetId) {
              grunt.log.writeln('For better performance, set spreadsheetId "' + info.spreadsheetId + '".');
            }

            if (!options.worksheetId) {
              grunt.log.writeln('For better performance, set worksheetId "' + info.worksheetId + '".');
            }

            var header = extend(rows["1"]);
            if (options.headerIsFirstRow) {
              delete rows["1"];
            }

            if (options.transformRow) {
              rows = Object.keys(rows).map(function(row) {
                return options.transformRow(rows[row], header);
              });
            }

            var data = options.includeInfo ? { rows: rows, info: info } : rows;

            grunt.file.write(filename, options.prettify ? JSON.stringify(data, null, 2) : JSON.stringify(data));
            grunt.log.writeln('Spreadsheet data written to "' + filename + '".');

            done(data);
        });
    });
  });
};
