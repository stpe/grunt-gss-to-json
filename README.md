# grunt-gss-to-json

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> Read Google Spreadsheet and save as JSON.

Using [edit-google-spreadsheet](https://www.npmjs.org/package/edit-google-spreadsheet) grunt-gss-to-json read a Google Spreadsheet and saves it as a JSON-file, optionally as an array with each row transformed using a custom function.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gss-to-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gss-to-json');
```

## The "gss_to_json" task

### Overview
In your project's Gruntfile, add a section named `gss_to_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gss_to_json: {
    dist: {
      options: {
        // edit-google-spreadsheet options go here
        debug: true,
        spreadsheetName: 'my-awesome-spreadsheet',
        worksheetName: 'Sheet1',
        // for better performance, use spreadsheetId and
        // worksheetId instead of name.
        spreadsheetId: '',
        worksheetId: '',
        // Choose from 1 of the 3 authentication methods:
        //    1. Username and Password
        username: 'my-name@google.email.com',
        password: 'my-5uper-t0p-secret-password',
        // OR 2. OAuth
        oauth : {
          email: 'my-name@google.email.com',
          keyFile: 'my-private-key.pem'
        },
        // OR 3. Token
        accessToken : {
          type: 'Bearer',
          token: 'my-generated-token'
        }

        // Specific grunt-gss-to-json options
        prettify: true,
        includeInfo: true,
        headerIsFirstRow: true
      },
      dest: 'file-to-write.json'
    }
  },
});
```

Please note that it is bad practice for security reasons to commit authentication credentials. See usage example below for an example of how to avoid that.

### Options

Please see the [edit-google-spreadsheet](https://www.npmjs.org/package/edit-google-spreadsheet) documentation for the authentication options passed along. [This blog post](http://www.nczonline.net/blog/2014/03/04/accessing-google-spreadsheets-from-node-js/) have instructions of how to setup access to a Google Spreadsheet that is *not* shared publicly.

The grunt-gss-to-json specific options follow below.

#### options.prettify
Type: `Boolean`
Default value: `true`

Save JSON prettified with indentation.

#### options.includeInfo
Type: `Boolean`
Default value: `true`

If true the resulting file is an object with two properties; ``rows`` (the worksheet as JSON) and ``info`` containing spreadsheet info (total cells and rows, when last updated, and more, including ``spreadsheetId`` and ``worksheetId``).

If false the resulting file will be the ``rows`` object as is.

#### options.headerIsFirstRow
Type: `Boolean`
Default value: `true`

If true the first row is considered as a header and is excluded from the result.

#### options.transformRow
Type: `Function`
Default value: `null`

The functions has two parameters, *row* and *header*. Both objects does look the same with property key being the column number and the value the cell content. Example:

```js
{
  "1": "Pilotwings",
  "2": "SNES",
  "3": "SNSP-PW-SCN"
}
```

If a cell is empty that column is missing. See below for example usage.

### Usage Examples

#### Default Options
In this example, oauth is used for authentication and each row is transformed into a key/value object where the key is the column header title lowercased, only including a-z.

```js
grunt.initConfig({
  gss: grunt.file.readJSON('grunt-gss.json'),

  gss_to_json: {
    dev: {
      options: {
        spreadsheetId: "6RjQ5UX0mnKRXUb91dl6tDn5prczk2B600XuANWiHXjhw",
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
      dest: "games.json"
    }
  },});
```

Please note how authentication credentials are not included in ``Gruntfile.js`` but instead read from ``grunt-gss.json`` which should be in your ``.gitignore`` together with your keyfile to avoid committing sensitive information.

Example ``grunt-gss.json``
```js
{
    "oath": {
        "email": "123456-lotsofcharactersmakingupyourid@developer.gserviceaccount.com",
        "keyFile": "./my-key-file.pem"
    }
}
```

## Contributing

Pull requests welcome.
