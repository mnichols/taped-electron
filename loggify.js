'use strict';
/**
 * This middleware runs on the CLIENT and writes the console log
 * output back to the server via its ipc connection.
 * */
(function ($window, $document) {
    // keep around so can call
    // console methods without sending data to server
    var nativeConsole = {}
    var ipc  = require('electron').ipcRenderer

    ;['error'
    , 'info'
    , 'log'
    , 'debug'
    , 'warn'
    ].forEach(function(k) {
      var nativeMethod = console[k]
      nativeConsole[k] = nativeMethod.bind(console)
      var prefix = k

      console[k] = function() {
        // keep original args so browser can log as usual
        var args = [].slice.call(arguments)
        write(prefix, args)
        return nativeMethod.apply(this, args)
      }
    })

    function write(prefix, args) {
      // prepare args for transport
      var cleanArgs = args.map(function(item) {
        // no sensible default for stringifying
        // DOM Elements nicely so just toString and let
        // whoever is logging handle stringification.
        //if (item && isDom(item)) return item.toString()
        return item
      })

      var output = cleanArgs.join(' ')
      var data = JSON.stringify([prefix].concat(output))
      var line = JSON.stringify([prefix,'\n'])
      ipc.send(`console:out`,data)
    }

})(window, document);

