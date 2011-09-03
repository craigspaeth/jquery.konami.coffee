describe "jQuery.konami", ->
  it "listens for the konami code keys then callsback", ->
    done = false
    waitsFor -> done
    $(window).konami -> 
      expect(0 is 0).toBeTruthy()
      done = true
    
    keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
    for key in keys
      $(window).trigger $.Event 'keydown', { keyCode: key }