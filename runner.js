'use strict';
import app from 'app'
import path from 'path'
import glob from 'glob'
import tape from 'blue-tape'
import BrowserWindow from 'browser-window'
import {ipcMain as ipc} from 'electron'
import {remote} from 'electron'

const runRendererTests = () => {
    //main process tests
    let tests = process.argv[2]
    glob(tests,(err,files)=>{
        if(err) {
            console.error(err)
            return app.quit()
        }
        let w = new BrowserWindow({width: 800, height: 600});
        const html = 'file://' + path.resolve(__dirname, 'index.html');
        w.webContents.on('dom-ready', function(){
            w.send('renderer-test', {
                files: files
            });
            w.openDevTools();
        });
        w.loadURL(html);

        ipc.on('renderer-tests-finished', function(event){
            event.sender.send('renderer-dead')
            setTimeout(()=>{
                w.destroy()
                app.quit()
            },1000)
        });
        ipc.on('console:out',function(event,args){
            let item = JSON.parse(args)
            console.log(item[1])
            //console.log('\n')
        })
    })

}


const runMainTests = () => {
    //main process tests
    let tests = process.argv[2]
    if(tests) {
        glob(tests,(err,files)=>{
            if(err) {
                console.error(err)
                return app.quit()
            }
            files.forEach(f=>{
                require(path.resolve(f))
            })
            tape.onFinish(()=>{
                app.quit()
            })
        })
    }
}
app.on('ready',() =>{
    runRendererTests()
})
