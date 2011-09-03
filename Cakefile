coffee = require 'coffee-script'
fs = require 'fs'

task 'build', 'generate the js for test and in root', (options) ->
  fs.readFile 'jquery.konami.coffee', (err, data) ->
    fs.writeFile 'jquery.konami.js', coffee.compile data.toString()
    fs.writeFile 'test/src/jquery.konami.js', coffee.compile data.toString()
  fs.readFile 'test/spec/jquery.konami_spec.coffee', (err, data) ->
    fs.writeFile 'test/spec/jquery.konami_spec.js', coffee.compile data.toString()