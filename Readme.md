jquery.konami.coffee
====================

A jQuery plugin to listen for a user entering the konami code.

Installation
------------

Simply copy and embed jquery.konami.js into your project.

    <script type="text/javascript" src="jquery.konami.js"></script>
  
Usage
-----

Simply attach the plugin to an element with a callback.

    $(window).konami(function(){ alert('Unicorn attack!')});
  
To build
--------

Yes, jQuery.konami is written in coffeescript. So you need to install [node](https://github.com/joyent/node), [npm](http://npmjs.org/), and [coffeescript](http://jashkenas.github.com/coffee-script/) to build. Then simply run the cake command.

    cake build
  
To run the test
---------------
  
jQuery.konami uses [Jasmine](http://pivotal.github.com/jasmine/) for testing. Open up SpecRunner.html to run test. The test is also written in coffeescript, so you'll have to run _cake build_ to compile the test too.

MIT License
-----------

Copyright (c) 2011 Craig Spaeth

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.