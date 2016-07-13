# Taped Electron

Run tape tests inside electron

This uses [blue-tape](https://github.com/spion/blue-tape) but is
just using tto run tests.

## Prerequisites

Have electron installed;

`npm install electron-prebuilt`

## Usage

`taped-electron --renderer {glob} --main {glob}`

When no process type is specified, the process is assumed to be the main process.

*Run Tests In Main Process*

`taped-electron /path/to/main/tests/**/*-test.js`

or

`taped-electron -m /path/to/main/tests/**/*-test.js`

or

`taped-electron --main /path/to/main/tests/**/*-test.js`

*Run Tests In Renderer Process*

`taped-electron --renderer /path/to/renderer/tests/**/*-test.js`

or

`taped-electron -r /path/to/renderer/tests/**/*-test.js`


*Run Tests In Both Processes*

`taped-electron -r /path/to/renderer/tests/**/*-test.js -m /path/to/main/tests/**/*.js`

*Use with a pretty reporter*

`npm install tap-spec`
`taped-electron --main ./test/main/**/*.* --renderer ./test/renderer/**/*.* | tap-spec`

## Testing 

If you want to confirm `taped-electron` you can clone the repo and `npm test`. You should see **2 failing tests** as well as **2 passing tests**.
This tests both the main and renderer processes.
