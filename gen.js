const fs = require('fs')

fs.writeFile('128K', new Array(131072).fill('0').join(''), () => {})
fs.writeFile('512K', new Array(524288).fill('0').join(''), () => {})
fs.writeFile('1M', new Array(1048576).fill('0').join(''), () => {})
fs.writeFile('5M', new Array(5242880).fill('0').join(''), () => {})
