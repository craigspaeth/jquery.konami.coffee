(($) ->
  $.fn.konami = (callback) ->
    code = [38,38,40,40,37,39,37,39,66,65]; keysDown = []
    $(@).bind 'keydown.konami', (e) ->
      keysDown.push e.keyCode
      keysDown = [] if keysDown.join('') isnt code.slice(0, keysDown.length).join('')
      callback() if keysDown.length is code.length
) jQuery