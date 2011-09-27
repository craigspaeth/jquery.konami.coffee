coffee = require 'coffee-script'
fs = require 'fs'

task 'build', 'generate the js for test and in root', (options) ->
  fs.readFile 'backbone-ext.coffee', (err, data) ->
    fs.writeFile 'backbone-ext.js', coffee.compile data.toString()
    fs.writeFile 'test/src/backbone-ext.js', coffee.compile data.toString()
  
  fs.readFile 'test/spec/backbone-ext_spec.coffee', (err, data) ->
    fs.writeFile 'test/spec/backbone-ext_spec.js', coffee.compile data.toString()