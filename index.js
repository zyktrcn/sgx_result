const fs = require('fs');
const node_echarts = require('node-echarts');

function getPic(data, titles, path, yAxisName, xAxisName, min) {
  const symbols = ['circle', 'rect', 'triangle', 'diamond']
  const option = {
      title: {
          text: ''
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: titles,
          top: '21%'
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      grid: {
          top: '20%',
          left: '6%',
          right: '4%',
          bottom: '6%',
          containLabel: true,
          show: true,
          borderColor: 'rgba(0, 0, 0, 1)'
      },
      xAxis: [{
          name: xAxisName,
          nameLocation: 'middle',
          nameTextStyle: {
              fontWeight: 'bold',
              fontSize: 16,
              padding: [5, 0, 15, 0]
          },
          nameLocation: 'middle',
          nameTextStyle: {
              fontSize: 16,
              padding: [15, 0, 5, 0]
          },
          type: 'category',
          data: new Array(7).fill('').map((_, index) => (index + 1) * 500),
          // data: ['k=2', 'k=4', 'k=8', 'k=16', 'k=32', 'k=64', 'k=128', 'k=256' ,'k=512' ,'k=1024'],
          axisTick: {
              alignWithLabel: true
          },
          axisLine: {
              show: false
          }
      }],
      yAxis: [{
          name: yAxisName,
          nameLocation: 'middle',
          nameTextStyle: {
              fontSize: 16,
              padding: [5, 0, 20, 0]
          },
          type: 'value',
          // max,
          min,
          splitNumber: 10,
          splitLine: {
              show: false
          },
          axisLine: {
              show: false
          },
      }],
      backgroundColor: '#fff',
      series: titles.map((val, index) => ({
        name: val,
        type: 'line',
        symbol: symbols[index],
        symbolSize: 7.5,
        data: data[index],
        lineStyle: {
            width: 1,
            opacity: 0.5
        },
        smooth: true
      }))
  };

  node_echarts({
      width: 600,
      option,
      path
  });
}

function readData(file) {
  const data = fs.readFileSync(file, 'utf-8').split('\n')
  let dataObj = []
  for (let i=0; i<data.length-1; i=i+4) {
    let encryption = Number(data[i + 1].split(':')[1]) - Number(data[i].split(':')[1])
    let decryption = Number(data[i + 3].split(':')[1]) - Number(data[i + 2].split(':')[1])

    dataObj.push({
      encryption,
      decryption,
    })
  }

  let result = []
  for (let i=0; i<dataObj.length; i=i+1000) {
    result.push(
      dataObj.slice(0, i+1000).reduce((total, val) => {
        const { encryption, decryption } = val
        return {
          encryption: total.encryption + encryption,
          decryption: total.decryption + decryption,
        }
      }, {
        encryption: 0,
        decryption: 0,
      })
    )
  }

  return result
}

// const aes128 = readData('./result/aes/result(aes-128).txt')
// const aes256 = readData('./result/aes/result(aes-256).txt')
// const aes128Sgx = readData('./result/aes/sgx_result(aes-128).txt')
// const aes256Sgx = readData('./result/aes/sgx_result(aes-256).txt')
// getPic(
//   [
//     aes128.map((val) => val.encryption / 10000),
//     aes256.map((val) => val.encryption / 10000),
//     aes128Sgx.map((val) => val.encryption / 10000),
//     aes256Sgx.map((val) => val.encryption / 10000),
//   ],
//   [
//     'REE(128KB)',
//     'REE(256KB)',
//     'TEE(128KB)',
//     'TEE(256KB)',
//   ],
//   './aes-encryption-en.jpg',
//   'Execution Time（10^4 ms）',
//   'Number of Files',
// )
// getPic(
//   [
//     aes128.map((val) => val.decryption / 10000),
//     aes256.map((val) => val.decryption / 10000),
//     aes128Sgx.map((val) => val.decryption / 10000),
//     aes256Sgx.map((val) => val.decryption / 10000),
//   ],
//   [
//     'REE(128KB)',
//     'REE(256KB)',
//     'TEE(128KB)',
//     'TEE(256KB)',
//   ],
//   './aes-decryption-en.jpg',
//   'Execution Time（10^4 ms）',
//   'Number of Files',
// )

// const rsa128 = readData('./result/rsa/result(rsa-128)-4.txt')
// const rsa256 = readData('./result/rsa/result(rsa-256)-4.txt')
// const rsa128Sgx = readData('./result/rsa/sgx_result(rsa-128)-4.txt')
// const rsa256Sgx = readData('./result/rsa/sgx_result(rsa-256)-4.txt')
// getPic(
//   [
//     rsa128.map((val) => val.encryption / 10000),
//     rsa256.map((val) => val.encryption / 10000),
//     rsa128Sgx.map((val) => val.encryption / 10000),
//     rsa256Sgx.map((val) => val.encryption / 10000),
//   ],
//   [
//     'REE(128KB)',
//     'REE(256KB)',
//     'TEE(128KB)',
//     'TEE(256KB)',
//   ],
//   './rsa-encryption-en.jpg',
//   'Execution Time（10^4 ms）',
//   'Number of Files',
// )
// getPic(
//   [
//     rsa128.map((val) => val.decryption / 10000),
//     rsa256.map((val) => val.decryption / 10000),
//     rsa128Sgx.map((val) => val.decryption / 10000),
//     rsa256Sgx.map((val) => val.decryption / 10000),
//   ],
//   [
//     'REE(128KB)',
//     'REE(256KB)',
//     'TEE(128KB)',
//     'TEE(256KB)',
//   ],
//   './rsa-decryption-en.jpg',
//   'Execution Time（10^4 ms）',
//   'Number of Files',
// )

function getData() {
  const data = JSON.parse(fs.readFileSync('./data.json'))

  let result = []
  for (let i=0; i<data.read.length; i=i+3) {
    let size = data.read[i + 2]
    let decenter = data.read[i + 1] * 1000
    let center = data.read[i] * 1000

    result.push({
      size,
      centeralized: center,
      decentralized: decenter,
    })
  }

  let read = []
  for (let i=0; i<result.length; i=i+1000) {
    read.push(
      result.slice(0, i+1000).reduce((total, val) => {
        const { centeralized, decentralized, size } = val
        return {
          size: total.size + size,
          centeralized: total.centeralized + centeralized,
          decentralized: total.decentralized + decentralized,
        }
      }, {
        size: 0,
        centeralized: 0,
        decentralized: 0,
      })
    )
  }

  result = []

  for (let i=0; i<data.write.length; i=i+3) {
    let size = data.write[i + 2]
    let decenter = data.write[i + 1] * 1000
    let center = data.write[i] * 1000

    result.push({
      size,
      centeralized: center,
      decentralized: decenter,
    })
  }

  let write = []
  for (let i=0; i<result.length; i=i+1000) {
    write.push(
      result.slice(0, i+1000).reduce((total, val) => {
        const { centeralized, decentralized, size } = val
        return {
          size: total.size + size,
          centeralized: total.centeralized + centeralized,
          decentralized: total.decentralized + decentralized,
        }
      }, {
        size: 0,
        centeralized: 0,
        decentralized: 0,
      })
    )
  }

  result = []

  for (let i=0; i<data.k.length; i=i+3) {
    let size = data.k[i + 2]
    let decenter = data.k[i + 1] * 1000
    let center = data.k[i] * 1000

    result.push({
      size,
      centeralized: center,
      decentralized: decenter,
    })
  }

  let k = []
  for (let i=0; i<result.length; i=i+500) {
    k.push(
      result.slice(0, i+500).reduce((total, val) => {
        const { centeralized, decentralized, size } = val
        return {
          size: total.size + size,
          centeralized: total.centeralized + centeralized,
          decentralized: total.decentralized + decentralized,
        }
      }, {
        size: 0,
        centeralized: 0,
        decentralized: 0,
      })
    )
  }

  result = []

  return {
    read,
    write,
    k,
  }
}

const { read, write, k } = getData()
console.log(read, write)
// getPic(
//   [
//     read.map((val) => val.size / val.centeralized),
//     read.map((val) => val.size / val.decentralized)
//   ],
//   [
//     'Centralized Server',
//     'Hyperledger Fabric',
//   ],
//   './read-en.jpg',
//   'Execution Speed（byte/ms）',
//   'Number of Photos',
// )
// getPic(
//   [
//     write.map((val) => val.size / val.centeralized),
//     write.map((val) => val.size / val.decentralized)
//   ],
//   [
//     'Centralized Server',
//     'Hyperledger Fabric',
//   ],
//   './write-en.jpg',
//   'Execution Speed（byte/ms）',
//   'Number of Photos',
// )
getPic(
  [
    k.map((val) => val.size / val.centeralized),
    k.map((val) => val.size / val.decentralized)
  ],
  [
    '4-peer',
    '8-peer',
  ],
  './k-en.jpg',
  'Execution Speed（byte/ms）',
  'Number of Photos',
  14,
)

function getKData() {
  const data = fs.readFileSync('./k-data.txt', 'utf-8').split('======').map((val) => val.split('\n'))
  let single = []
  for (let i=0; i<data[0].length; i=i+3) {
    single.push(
      Number(data[0][i+2].split(': ')[1]) - Number(data[0][i+1].split(': ')[1])
    )
  }

  let mutiple = []
  for (let i=0; i<data[1].length; i=i+3) {
    mutiple.push(
      Number(data[1][i+2].split(': ')[1]) - Number(data[1][i+1].split(': ')[1])
    )
  }

  return [
    single.map((val) => 587 / val * 1000).reverse(),
    mutiple.map((val) => 587 / val * 1000).reverse()
  ]
}

// getPic(
//   getKData(),
//   [
//     'SGX Single Launch',
//     'SGX Mutiple Launch',
//   ],
//   './k-params-en.jpg',
//   'Execution Speed（10^-3 btye/ms）',
//   'K Param',
// )