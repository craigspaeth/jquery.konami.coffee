(function() {
  describe("jQuery.konami", function() {
    return it("listens for the konami code keys then callsback", function() {
      var done, key, keys, _i, _len, _results;
      done = false;
      waitsFor(function() {
        return done;
      });
      $(window).konami(function() {
        expect(0 === 0).toBeTruthy();
        return done = true;
      });
      keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        _results.push($(window).trigger($.Event('keydown', {
          keyCode: key
        })));
      }
      return _results;
    });
  });
}).call(this);
