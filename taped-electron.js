'use strict';

import {join} from 'path'
import electron from 'electron-prebuilt'
import {spawnSync,spawn} from 'child_process'
import {Readable} from 'stream'

let args = [join(__dirname,'runner-up')].concat(process.argv.slice(2))
let proc = spawn(electron, args,{stdio:'inherit'})
let reader = new Readable()
reader._read = function(){}
reader.pipe(process.stdout).pipe(faucet)
proc.on('data',(data)=>{
    reader.push(data)
})
proc.on('close',(code)=>{
    process.exit(code)
})




