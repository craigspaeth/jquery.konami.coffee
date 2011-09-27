# Run an entire suite aynchronously
_done = false
@done = -> _done = true
@runAsync = ->
  beforeEach -> _done = false
  afterEach -> waitsFor -> _done
  
# View
describe 'BackboneExt.View', ->
  
  describe 'fetchThenRender', ->
    
    runAsync()
    
    class View extends BackboneExt.View
    class Dog extends BackboneExt.Model
    view = new View
    
    it 'fetches a model by id, renders a preloader then renders', ->
      Backbone.sync = (method, model, options) ->
        options.success new Dog { id: 'foo' }
      calls = ''
      view.renderPreloader = -> calls += 'p'
      view.render = -> 
        calls += 'r'
        expect(calls).toEqual 'pr'
        done()
      view.fetchThenRender Dog, 'foo'

# Collection
describe 'BackboneExt.Collection', ->
  
  describe 'fetchFromUrl', ->
    
    runAsync()
    
    it 'fetches a collection from the supplied url passing on the fetch options', ->
      class Artworks extends BackboneExt.Collection
      Backbone.sync = (method, model, options) ->
        expect(model.url).toEqual '/artworks'
        options.success new Artworks [{ id: 'foo' },{ id: 'bar' }]
      Artworks.fetchFromUrl '/artworks',
        success: (collection) ->
          expect(collection.models?).toBeTruthy()
          done()

# Model
describe 'BackboneExt.Model', ->
  
  model = new BackboneExt.Model foo: 'bar'
  
  it 'extends a backbone model', -> expect(model.get 'foo').toEqual 'bar'
  
  describe 'fetchFromUrl', ->
  
    runAsync()
    
    it 'fetches a new model using the passing on the fetch options', ->
      class Artwork extends BackboneExt.Model
          rootUrl: 'artwork/'
      Backbone.sync = (method, model, options) ->
        options.success new Artwork { id: 'foo' }
      Artwork.fetch 'foo',
        success: (model) ->
          expect(model.get('id')).toEqual 'foo'
          done()
  
  describe '_setRelations', ->
    
    class Artist extends BackboneExt.Model
    class Artwork extends BackboneExt.Model
    class Artworks extends Backbone.Collection
      model: Artwork
    describe 'as a hasOne relation', ->
      
      beforeEach ->
        model = new Artwork artist: { name: 'Andy Warhol' }
        model.relations = [
            {
              type: 'HasOne'
              key: 'artist'
              model: Artist
            }
        ]
        model._setRelations()
      
      it 'sets a model with that data in the key', ->
        expect(model.get('artist').get('name')).toEqual('Andy Warhol')
  
      it 'does not try to set the model if there is no key', ->
        model.unset 'artist'
        expect(model.get('artist')?).toBeFalsy()
    
      it 'sets new relations if passed data', ->
        model.set { artist: { id: 'picasso', name: 'Pablo Picasso' } }
        expect(model.get('artist').get('name')).toEqual('Pablo Picasso')
      
      it 'doesnt try to set up relations for non-object', ->
        model.set { artist: 'garbage' }
        expect(model.get('artist')).toEqual('garbage')
    
    describe 'as a hasMany relation', ->
      
      beforeEach ->
        model = new Artist artworks: [
          { id: 'flowers', title: 'Flowers' }
          { id: 'skull', title: 'Flowers' }
        ]
        model.relations = [
            {
              type: 'HasMany'
              key: 'artworks'
              model: Artworks
            }
        ]
        model._setRelations()
      
      it 'sets a collection with that data', ->
        expect(model.get('artworks').get('flowers').get('title')).toEqual('Flowers')
        
      it 'doesnt try to set up relations for non-array', ->
        model.set { artworks: 'garbage' }
        expect(model.get('artworks')).toEqual('garbage')
        model.set { artworks: { garbarge: 'garbage' } }
        expect(model.get('artworks')).toEqual({ garbarge: 'garbage' })

  it "sets relations upon init", ->
    class Tail extends BackboneExt.Model
    class Foot extends BackboneExt.Model
    class Feet extends Backbone.Collection
        model: Foot
    class Dog extends BackboneExt.Model
        relations: [
          {
            type: 'HasOne'
            key: 'tail'
            model: Foot
          }
          {
            type: 'HasMany'
            key: 'feet'
            model: Feet
          }
        ]
    puppy = new Dog
      tail: { id: 'furry' }
      feet: [{ id: 'left_foot'},{ id: 'right_foot' }]
    
    expect(puppy.get('tail').get 'id').toEqual 'furry'
    expect(puppy.get('feet').get('left_foot').get('id')).toEqual 'left_foot' 
  
  describe 'getToString', ->
  
    it 'should return an empty string for undefined properties', ->
      expect(model.getToString('not_a_property')).toEqual ''
      
# Router
describe 'BackboneExt.Router', ->

  xit 'triggers a route:afterAny event when hitting a new route'
  xit 'triggers a route:any event when hitting a new route'
  xit 'calls any then route then an afterAny'
  xit 'set a lastRoute whenever hitting a route'
  xit 'cancels a route when calling cancelRoute'
  xit 'defers a route when calling deferRoute'
  xit 'can accept routes with any number of params'