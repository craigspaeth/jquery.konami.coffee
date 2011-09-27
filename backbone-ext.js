(function() {
  var BackboneExt;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  if (typeof exports != "undefined" && exports !== null) {
    BackboneExt = exports;
  } else {
    BackboneExt = this.BackboneExt = {};
  }
  BackboneExt.View = (function() {
    function View() {
      View.__super__.constructor.apply(this, arguments);
    }
    __extends(View, Backbone.View);
    View.prototype.fetchThenRender = function(modelClass, id) {
      this.renderPreloader();
      new modelClass({
        id: id
      }).fetch({
        success: __bind(function() {
          return this.render();
        }, this),
        error: __bind(function() {
          return this.renderError();
        }, this)
      });
      return this;
    };
    View.prototype.renderError = function() {};
    View.prototype.renderPreloader = function() {};
    return View;
  })();
  BackboneExt.Collection = (function() {
    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }
    __extends(Collection, Backbone.Collection);
    Collection.fetchFromUrl = function(url, options) {
      var collection;
      collection = new this;
      collection.url = url;
      return collection.fetch(options);
    };
    return Collection;
  })();
  BackboneExt.Model = (function() {
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    __extends(Model, Backbone.Model);
    Model.prototype.initialize = function(attributes, options) {
      Model.__super__.initialize.call(this, attributes, options);
      this._setRelations();
      return this.bind("change", __bind(function() {
        return this._setRelations();
      }, this));
    };
    Model.prototype.getToString = function(attributeName) {
      var _ref;
      return (_ref = this.get(attributeName)) != null ? _ref : '';
    };
    Model.prototype._setRelations = function() {
      var collection, data, model, relation, _i, _len, _ref;
      if (this.relations == null) {
        return;
      }
      data = {};
      _ref = this.relations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        relation = _ref[_i];
        if (relation.type === 'HasOne' && (this.get(relation.key) != null) && typeof this.get(relation.key) === 'object') {
          model = new relation.model(this.get(relation.key));
          data[relation.key] = model;
        }
        if (relation.type === 'HasMany' && (this.get(relation.key) != null) && _.isArray(this.get(relation.key))) {
          collection = new relation.model(this.get(relation.key));
          data[relation.key] = collection;
        }
      }
      return this.set(data);
    };
    Model.fetch = function(id, options) {
      return new this({
        id: id
      }).fetch(options);
    };
    return Model;
  })();
  BackboneExt.Router = (function() {
    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }
    __extends(Router, Backbone.Router);
    Router.prototype.lastRoute = {};
    Router.prototype.initialize = function(options) {
      this.options = options;
      return _.defer(function() {
        return Backbone.history.start();
      });
    };
    Router.prototype._bindRoutes = function() {
      var action, func, route, _ref, _results;
      _ref = this.routes;
      _results = [];
      for (route in _ref) {
        action = _ref[route];
        _results.push(route === '' || route.substring(0, 1 !== '/') ? (func = function() {
          var afterAction, args, lastActionName;
          action = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (!_.isEmpty(this.lastRoute)) {
            lastActionName = _.first(_.values(this.lastRoute));
            afterAction = 'route:after' + _.capitalize(lastActionName);
            if (this[afterAction] != null) {
              this[afterAction]();
            }
          }
          this.lastRoute[route] = action;
          this._lastArgs = args;
          this.afterAny();
          this.trigger('route:afterAny');
          if (!this._cancelNextRoute) {
            this[action].apply(this, args);
            this._cancelNextRoute = false;
            this.any();
            return this.trigger('any');
          }
        }, this.route("!/" + route, action, _.bind(func, this, action)), this.route(route, action, _.bind(func, this, action))) : void 0);
      }
      return _results;
    };
    Router.prototype.cancelRoute = function() {
      return this._cancelNextRoute = true;
    };
    Router.prototype.deferRoute = function() {
      this[_.first(_.values(this.lastRoute))].apply(this, this._lastArgs);
      this.any();
      return this.trigger('any');
    };
    Router.prototype.any = function() {};
    Router.prototype.afterAny = function() {};
    return Router;
  })();
}).call(this);
