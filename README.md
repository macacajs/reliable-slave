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
