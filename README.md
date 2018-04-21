# reliable-macaca-slave

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/reliable-macaca-slave.svg?style=flat-square
[npm-url]: https://npmjs.org/package/reliable-macaca-slave
[travis-image]: https://img.shields.io/travis/reliablejs/reliable-macaca-slave.svg?style=flat-square
[travis-url]: https://travis-ci.org/reliablejs/reliable-macaca-slave
[download-image]: https://img.shields.io/npm/dm/reliable-macaca-slave.svg?style=flat-square
[download-url]: https://npmjs.org/package/reliable-macaca-slave

reliable-macaca-slave is the slave part of the [Reliable](https://github.com/reliablejs). Here for adapt to [macaca-cli](//github.com/macacajs/macaca-cli), which in order to provide continuous integration service.

## Installment

```shell
$ brew install zeromq ## if you are using Mac os
$ npm i reliable-macaca-slave -g
```

## Quick Start

```shell
# connect to reliable master
$ reliable server -m <reliable-master:port> --verbose
```

## Docs

[reliable-macaca-slave Deployment Guide](//macacajs.github.io/slave-deployment.html)

## Docker

```shell
#build
$ docker build -f Dockerfile .
```
<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/1044425?v=4" width="100px;"/><br/><sub><b>ziczhu</b></sub>](https://github.com/ziczhu)<br/>|[<img src="https://avatars3.githubusercontent.com/u/15025212?v=4" width="100px;"/><br/><sub><b>zhuyali</b></sub>](https://github.com/zhuyali)<br/>|[<img src="https://avatars1.githubusercontent.com/u/6777312?v=4" width="100px;"/><br/><sub><b>raininfall</b></sub>](https://github.com/raininfall)<br/>|[<img src="https://avatars3.githubusercontent.com/u/5086369?v=4" width="100px;"/><br/><sub><b>brunoyang</b></sub>](https://github.com/brunoyang)<br/>
| :---: | :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto upated at `Sat Apr 21 2018 18:11:09 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->
