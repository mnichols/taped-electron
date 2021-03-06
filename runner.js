'use strict';

const electron      = require('electron')
const app           = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc           = electron.ipcMain
const remote        = electron.remote
const path          = require('path')
const glob          = require('glob')
const tape          = require('blue-tape')
const minimist      = require('minimist')
const dbg           = require('debug')
const packagejson   = require('./package.json')

const log           = dbg('taped-electron:debug')
const opts          = minimist(process.argv.slice(2))

log('using opts', opts)


const runRendererTests = (tests, done) => {
    if(tests) {
        let globOpts = {
            realpath: true //abs path name
        }
        glob(tests, globOpts, (err,files)=>{
            if(err) {
                console.error('taped-electron','renderer process error',err)
                return done(err)
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

            ipc.on('error', function(event, error ){
                console.error('taped-electron','renderer process error',error)
                setTimeout(()=>{
                    win.destroy()
                    done(error)
                },500)
            })
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
            try {
                if(err) {
                    console.error('taped-electron','main process error',err)
                    return done(err)
                }
                files.forEach(f=>{
                    require(path.resolve(f))
                })
                tape.onFinish(done.bind(this))
            } catch(err) {
                console.error('taped-electron','main process error',err)
                done(err)
            }
        })
    }
}
let done = (err,processTypes) => {
    if(err) {
        app.exit(1)
    }
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
        runRendererTests(rendererTests,(err) => {
            done(err, --processTypes)
        })
    }
    if(mainTests) {
        processTypes++
        runMainTests(mainTests, (err) => {
            done(err, --processTypes)
        })
    }
})
