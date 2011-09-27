#-------------------------------------------------------------------------------------------------- 
# Backbone Extension is a set of 'classes' that extend Backbone functionality.
# Simply extend BackboneExt instead of Backbone to use some of the useful features.
# 
#   e.g. class Artwork extends BackboneExt.Model
#--------------------------------------------------------------------------------------------------

if exports?
  BackboneExt = exports
else
  BackboneExt = @BackboneExt = {}

#--------------------------------------------------------------------------------------------------
# View
#--------------------------------------------------------------------------------------------------
class BackboneExt.View extends Backbone.View
  
  # Fetches a model
  # In the mean time calls @renderPreloader()
  # Once fetched, calls @render()
  # If there was a server error it calls @renderError()
  fetchThenRender: (modelClass, id) ->
    @renderPreloader()
    new modelClass({ id: id }).fetch
      success: => @render()
      error: => @renderError()
    @
  
  # # Fetches a collection using the Repository.
  # # In the mean time calls @renderPreloader()
  # # Once fetched, calls @render()
  # # If there was a server error it calls @renderError()
  # getFromUrlThenRender: (collectionName, url) ->
  #   @fetchedFromUrl = url
  #   repoName = collectionName.pluralize().camelize().ucFirst()
  #   @collection = App.Repositories[repoName].getFromUrl url,
  #     preload: => @renderPreloader()
  #     success: => _.defer =>
  #       @render()
  #       @delegateEvents()
  #     error: => @renderError()
  #   @
  
  renderError: ->
  renderPreloader: ->
  
  # toString: -> "App.Views.#{className(@)}"  
  #   
  # # Common transition functions
  # fadeOut: (duration = 'fast', callback) -> $(@el).fadeOut duration, => callback.apply(@) if callback?
  # fadeIn: (duration = 'fast', callback) -> $(@el).fadeIn duration, => callback() if callback?

#--------------------------------------------------------------------------------------------------
# Collection
#--------------------------------------------------------------------------------------------------
class BackboneExt.Collection extends Backbone.Collection
  
  # Convienience static method to fetch a new collection from a url
  @fetchFromUrl: (url, options) ->
    collection = new @
    collection.url = url
    collection.fetch options

#--------------------------------------------------------------------------------------------------
# Model
#--------------------------------------------------------------------------------------------------
class BackboneExt.Model extends Backbone.Model
    
  initialize: (attributes, options) ->
    super attributes, options
      
    # Store relations
    @_setRelations()
    @bind "change", => @_setRelations()
  
  # Used in templates to easily not show 'undefined' or 'null'
  getToString: (attributeName) -> @get(attributeName) ? ''
  
  # Sets up relations defined in a model
  # Relations are defined as either 'HasOne' or 'HasMany' by the following params:
  # [
  #   {
  #     type: 'HasOne'
  #     key: 'artwork'
  #     model: 'Artworks'
  #   }
  # ]
  # type: either 'HasOne' or 'HasMany'
  # key: the attribute already stored on the model which is fed into the new model or collection
  # model: the name of the collection or related model. (Automagically set up with our namespace)
  # 
  _setRelations: ->
    return unless @relations?
    data = {}
    for relation in @relations
      
      # HasOne relations
      if relation.type is 'HasOne' and @get(relation.key)? and typeof @get(relation.key) is 'object'
        model = new relation.model @get relation.key
        data[relation.key] = model
      
      # HasMany relations
      if relation.type is 'HasMany' and @get(relation.key)? and _.isArray @get(relation.key)
        collection = new relation.model @get relation.key
        data[relation.key] = collection
    
    @set data
  
  # Convienience static method to fetch a new model from the rootUrl
  @fetch: (id, options) -> new @({ id: id }).fetch options

#--------------------------------------------------------------------------------------------------
# Router
#--------------------------------------------------------------------------------------------------
class BackboneExt.Router extends Backbone.Router

  lastRoute: {}

  initialize: (options) ->
    @options = options
    _.defer -> Backbone.history.start()
  
  # Override bind routes to automagically bind hash bangs + add any & afterAny functionality
  _bindRoutes: ->
    for route, action of @routes
      
      # Make sure any routes without a leading slash are bound with one
      if route is '' or route.substring 0, 1 isnt '/'
        func = (action, args...) ->
          
          # Call an after action if it exists
          unless _.isEmpty @lastRoute
            lastActionName = _.first(_.values(@lastRoute))
            afterAction = 'route:after' + _.capitalize lastActionName
            @[afterAction]() if @[afterAction]?
        
          # Set lastRoute to help determine where a user is coming from
          @lastRoute[route] = action
          @_lastArgs = args
          
          @afterAny()
          @trigger 'route:afterAny'
          
          unless @_cancelNextRoute
            @[action] args...
            @_cancelNextRoute = false
          
            @any()
            @trigger 'any'
        
        @route "!/#{route}", action, _.bind(func, @, action)
        @route route, action, _.bind(func, @, action)
  
  # Cancels the next route action that is about to be called. any and afterAny are still called.
  cancelRoute: -> @_cancelNextRoute = true
  
  # Calls the last route action. 
  # In combination with cancelRoute this can allow route actions to be defered, or called later
  # after a callback.
  deferRoute: ->
    @[_.first _.values @lastRoute] @_lastArgs...
    @any()
    @trigger 'any'
  
  # No-op functions called before and after a route
  any: ->
  afterAny: ->