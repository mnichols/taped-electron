'use strict';

import test from 'blue-tape'
import {ipcRenderer as ipc} from 'electron'

test('windowed',(assert) => {
    assert.ok(window)
    assert.end()
})
tape.onFinish(function(){
    ipc.on('renderer-dead',()=>{
        process.exit(0)
    })
    //console.log('finished')
    ipc.send('renderer-tests-finished')
})
