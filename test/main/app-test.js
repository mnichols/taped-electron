'use strict';

import test from 'blue-tape'

test('happy',(assert) => {
    assert.pass(':)')
    assert.end()
})
test('sad',(assert) => {
    assert.fail(':(')
    assert.end()
})
test('async happy',(assert) => {
    return Promise.resolve()
    .then(()=> {
        assert.equal(42,42)
    })
})
test('async sad',(assert) => {
    return Promise.resolve()
    .then(()=> {
        assert.equal(43,42)
    })
})


