'use strict';

import test from 'blue-tape'
import {ipcRenderer as ipc} from 'electron'

test('windowed',(assert) => {
    //assert.fail('bonk')
    assert.ok(window)
    assert.end()
})
