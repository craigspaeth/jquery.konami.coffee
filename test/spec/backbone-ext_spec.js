(function() {
  var _done;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _done = false;
  this.done = function() {
    return _done = true;
  };
  this.runAsync = function() {
    beforeEach(function() {
      return _done = false;
    });
    return afterEach(function() {
      return waitsFor(function() {
        return _done;
      });
    });
  };
  describe('BackboneExt.View', function() {
    return describe('fetchThenRender', function() {
      var Dog, View, view;
      runAsync();
      View = (function() {
        function View() {
          View.__super__.constructor.apply(this, arguments);
        }
        __extends(View, BackboneExt.View);
        return View;
      })();
      Dog = (function() {
        function Dog() {
          Dog.__super__.constructor.apply(this, arguments);
        }
        __extends(Dog, BackboneExt.Model);
        return Dog;
      })();
      view = new View;
      return it('fetches a model by id, renders a preloader then renders', function() {
        var calls;
        Backbone.sync = function(method, model, options) {
          return options.success(new Dog({
            id: 'foo'
          }));
        };
        calls = '';
        view.renderPreloader = function() {
          return calls += 'p';
        };
        view.render = function() {
          calls += 'r';
          expect(calls).toEqual('pr');
          return done();
        };
        return view.fetchThenRender(Dog, 'foo');
      });
    });
  });
  describe('BackboneExt.Collection', function() {
    return describe('fetchFromUrl', function() {
      runAsync();
      return it('fetches a collection from the supplied url passing on the fetch options', function() {
        var Artworks;
        Artworks = (function() {
          function Artworks() {
            Artworks.__super__.constructor.apply(this, arguments);
          }
          __extends(Artworks, BackboneExt.Collection);
          return Artworks;
        })();
        Backbone.sync = function(method, model, options) {
          expect(model.url).toEqual('/artworks');
          return options.success(new Artworks([
            {
              id: 'foo'
            }, {
              id: 'bar'
            }
          ]));
        };
        return Artworks.fetchFromUrl('/artworks', {
          success: function(collection) {
            expect(collection.models != null).toBeTruthy();
            return done();
          }
        });
      });
    });
  });
  describe('BackboneExt.Model', function() {
    var model;
    model = new BackboneExt.Model({
      foo: 'bar'
    });
    it('extends a backbone model', function() {
      return expect(model.get('foo')).toEqual('bar');
    });
    describe('fetchFromUrl', function() {
      runAsync();
      return it('fetches a new model using the passing on the fetch options', function() {
        var Artwork;
        Artwork = (function() {
          function Artwork() {
            Artwork.__super__.constructor.apply(this, arguments);
          }
          __extends(Artwork, BackboneExt.Model);
          Artwork.prototype.rootUrl = 'artwork/';
          return Artwork;
        })();
        Backbone.sync = function(method, model, options) {
          return options.success(new Artwork({
            id: 'foo'
          }));
        };
        return Artwork.fetch('foo', {
          success: function(model) {
            expect(model.get('id')).toEqual('foo');
            return done();
          }
        });
      });
    });
    describe('_setRelations', function() {
      var Artist, Artwork, Artworks;
      Artist = (function() {
        function Artist() {
          Artist.__super__.constructor.apply(this, arguments);
        }
        __extends(Artist, BackboneExt.Model);
        return Artist;
      })();
      Artwork = (function() {
        function Artwork() {
          Artwork.__super__.constructor.apply(this, arguments);
        }
        __extends(Artwork, BackboneExt.Model);
        return Artwork;
      })();
      Artworks = (function() {
        function Artworks() {
          Artworks.__super__.constructor.apply(this, arguments);
        }
        __extends(Artworks, Backbone.Collection);
        Artworks.prototype.model = Artwork;
        return Artworks;
      })();
      describe('as a hasOne relation', function() {
        beforeEach(function() {
          model = new Artwork({
            artist: {
              name: 'Andy Warhol'
            }
          });
          model.relations = [
            {
              type: 'HasOne',
              key: 'artist',
              model: Artist
            }
          ];
          return model._setRelations();
        });
        it('sets a model with that data in the key', function() {
          return expect(model.get('artist').get('name')).toEqual('Andy Warhol');
        });
        it('does not try to set the model if there is no key', function() {
          model.unset('artist');
          return expect(model.get('artist') != null).toBeFalsy();
        });
        it('sets new relations if passed data', function() {
          model.set({
            artist: {
              id: 'picasso',
              name: 'Pablo Picasso'
            }
          });
          return expect(model.get('artist').get('name')).toEqual('Pablo Picasso');
        });
        return it('doesnt try to set up relations for non-object', function() {
          model.set({
            artist: 'garbage'
          });
          return expect(model.get('artist')).toEqual('garbage');
        });
      });
      return describe('as a hasMany relation', function() {
        beforeEach(function() {
          model = new Artist({
            artworks: [
              {
                id: 'flowers',
                title: 'Flowers'
              }, {
                id: 'skull',
                title: 'Flowers'
              }
            ]
          });
          model.relations = [
            {
              type: 'HasMany',
              key: 'artworks',
              model: Artworks
            }
          ];
          return model._setRelations();
        });
        it('sets a collection with that data', function() {
          return expect(model.get('artworks').get('flowers').get('title')).toEqual('Flowers');
        });
        return it('doesnt try to set up relations for non-array', function() {
          model.set({
            artworks: 'garbage'
          });
          expect(model.get('artworks')).toEqual('garbage');
          model.set({
            artworks: {
              garbarge: 'garbage'
            }
          });
          return expect(model.get('artworks')).toEqual({
            garbarge: 'garbage'
          });
        });
      });
    });
    it("sets relations upon init", function() {
      var Dog, Feet, Foot, Tail, puppy;
      Tail = (function() {
        function Tail() {
          Tail.__super__.constructor.apply(this, arguments);
        }
        __extends(Tail, BackboneExt.Model);
        return Tail;
      })();
      Foot = (function() {
        function Foot() {
          Foot.__super__.constructor.apply(this, arguments);
        }
        __extends(Foot, BackboneExt.Model);
        return Foot;
      })();
      Feet = (function() {
        function Feet() {
          Feet.__super__.constructor.apply(this, arguments);
        }
        __extends(Feet, Backbone.Collection);
        Feet.prototype.model = Foot;
        return Feet;
      })();
      Dog = (function() {
        function Dog() {
          Dog.__super__.constructor.apply(this, arguments);
        }
        __extends(Dog, BackboneExt.Model);
        Dog.prototype.relations = [
          {
            type: 'HasOne',
            key: 'tail',
            model: Foot
          }, {
            type: 'HasMany',
            key: 'feet',
            model: Feet
          }
        ];
        return Dog;
      })();
      puppy = new Dog({
        tail: {
          id: 'furry'
        },
        feet: [
          {
            id: 'left_foot'
          }, {
            id: 'right_foot'
          }
        ]
      });
      expect(puppy.get('tail').get('id')).toEqual('furry');
      return expect(puppy.get('feet').get('left_foot').get('id')).toEqual('left_foot');
    });
    return describe('getToString', function() {
      return it('should return an empty string for undefined properties', function() {
        return expect(model.getToString('not_a_property')).toEqual('');
      });
    });
  });
  describe('BackboneExt.Router', function() {
    xit('triggers a route:afterAny event when hitting a new route');
    xit('triggers a route:any event when hitting a new route');
    xit('calls any then route then an afterAny');
    xit('set a lastRoute whenever hitting a route');
    xit('cancels a route when calling cancelRoute');
    xit('defers a route when calling deferRoute');
    return xit('can accept routes with any number of params');
  });
}).call(this);
