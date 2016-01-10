'use strict';

var app = require('app')
var path = require('path')
var glob = require('glob')
var tape = require('blue-tape')
var BrowserWindow = require('browser-window')
var ipc = require('electron').ipcMain
var remote = require('electron').remote
var opts = require('nomnom').parse()

const runRendererTests = (tests, done) => {
    if(tests) {
        let globOpts = {
            realpath: true //abs path name
        }
        glob(tests, globOpts, (err,files)=>{
            if(err) {
                console.error(err)
                return app.quit()
            }
            const win = new BrowserWindow({width: 800, height: 600});
            const html = 'file://' + path.resolve(__dirname, 'runner.html');
            win.webContents.on('dom-ready', function(){
                win.send('start-renderer-tests', {
                    files: files
                });
                win.openDevTools();
            });
            win.loadURL(html);

            ipc.on('renderer-tests-finished', function(event){
                setTimeout(()=>{
                    win.destroy()
                    done()
                },1000)
            });
            ipc.on('console:out',function(event,args){
                let item = JSON.parse(args)
                console.log(item[1])
                //console.log('\n')
            })
        })

    }
}


const runMainTests = (tests, done) => {
    if(tests) {
        let globOpts = {
            realpath: true //abs path name
        }
        glob(tests, globOpts, (err,files)=>{
            if(err) {
                console.error(err)
                return app.quit()
            }
            files.forEach(f=>{
                require(path.resolve(f))
            })
            tape.onFinish(done)
        })
    }
}
let done = (processTypes) => {
    if(processTypes < 1) {
        app.quit()
    }
}
app.on('ready',() =>{
    let rendererTests = (opts.r || opts.renderer)
    let mainTests = (opts.m || opts.main)
    //no process specified, so just assume the main process
    if(!rendererTests && !mainTests) {
        mainTests = opts[0]
    }
    let processTypes = 0
    if(rendererTests) {
        processTypes++
        runRendererTests(rendererTests,() => {
            done(--processTypes)
        })
    }
    if(mainTests) {
        processTypes++
        runMainTests(mainTests, () => {
            done(--processTypes)
        })
    }
})
