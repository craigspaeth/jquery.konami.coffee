   _   ____                                                          _ 
  (_) /___ \_   _  ___ _ __ _   _    /\ /\___  _ __   __ _ _ __ ___ (_)
  | |//  / / | | |/ _ \ '__| | | |  / //_/ _ \| '_ \ / _` | '_ ` _ \| |
  | / \_/ /| |_| |  __/ |  | |_| |_/ __ \ (_) | | | | (_| | | | | | | |
 _/ \___,_\ \__,_|\___|_|   \__, (_)/  \/\___/|_| |_|\__,_|_| |_| |_|_|
|__/

jQuery.konami
=============

A jQuery plugin to listen for a user entering the konami code.

Installation
------------

Simply copy and embed jquery.konami.js into your project.

  <script type="text/javascript" src="src/jquery.konami.js"></script>
  
To build
--------

Yes, jQuery.konami is written in coffeescript. So you need to install [node](https://github.com/joyent/node), [npm](http://npmjs.org/), and [coffeescript](http://jashkenas.github.com/coffee-script/) to build. Then simply run the cake command.

  cake build
  
To run the tests
----------------
  
jQuery.konami uses [Jasmine](http://pivotal.github.com/jasmine/) for testing. Open up SpecRunner.html to run tests. The tests are also written in coffeescript, so you'll have to run _cake build_ to compile the tests too.


