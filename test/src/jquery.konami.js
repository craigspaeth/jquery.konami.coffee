(function() {
  (function($) {
    return $.fn.konami = function(callback) {
      var code, keysDown;
      code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
      keysDown = [];
      return $(this).bind('keydown.konami', function(e) {
        keysDown.push(e.keyCode);
        if (keysDown.join('') !== code.slice(0, keysDown.length).join('')) {
          keysDown = [];
        }
        if (keysDown.length === code.length) {
          return callback();
        }
      });
    };
  })(jQuery);
}).call(this);
