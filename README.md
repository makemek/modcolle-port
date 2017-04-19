# Modcolle Port [![Build Status](https://travis-ci.org/makemek/modcolle-port.svg?branch=master)](https://travis-ci.org/makemek/modcolle-port)

> Modcolle does not encourage botting or cheating Kancolle by any means.
Modcolle aims to resolve common frustrations for both old and new players and to enhance user expierence.
Modcolle does not intend to compete with other Kancolle viewers as they solve a different problem entirely, but to run in harmony among those viewers.

A microservice of [Modcolle](https://github.com/makemek/Modcolle) provides value of `api_port` back to a client.
When accessing [Port](http://i.imgur.com/va2mdIz.jpg) page, client doesn't have to adjust their machine time to match with Japan timezone (Asia/Tokyo UTC+09).
`api_port` is a seemingly random signature of numbers created by Kancolle Dev to prevent botting and cheating.
This signature, however, prevent players who doesn't have their clock synchronized with Japan timezone from accessing Kancolle API `api_port/port` endpoint.
They will receive [catbomb](http://vignette3.wikia.nocookie.net/kancolle/images/5/59/Kancolle_error.png/revision/latest?cb=20150813190500) over and over again.

Modcolle doesn't care how Kancolle's api_port signature system is implemented.
It only calls Kancolle's internal actionscript method which is responsible for generating the signature through [custom written scripts](https://github.com/makemek/modcolle-port/blob/master/build/as3-import/scripts/Core.as).
The script will be injected to `Core.as` inside `Core.swf` on Docker deployment.

Signature changes when there is a new release happened during Kancolle maintenace.
Modcolle Port doesn't handle this situation yet, but will do in a future release.

## Installation

### Deploying on Docker
In this repository, run
```
docker build -t port .
```
Then, run the image expose port 5000
```
docker run -d -p 5000:5000 --name modcolle-port port
```
Let's call its API. In the browser type
```
http://localhost:5000/act?role=api_port&cmd=calculate&memberId=123456
```
You will get a JSON response. The value varies
```json
{"api_port":"414563189173858047892811761507"}
```

### Developing locally
If you prefer not to use docker, you can install it manually.
You can follow scripts defined in [.travis.yml](https://github.com/makemek/modcolle-port/blob/master/.travis.yml) or [Dockerfile](https://github.com/makemek/modcolle-port/blob/master/Dockerfile) if you are on a Linux Ubuntu machine.
If you are running on Windows or other Linux distros, please follow these steps

#### Prerequisites
You need
- [Python2](https://www.python.org/downloads/)
- [Java SDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [FFDec](https://www.free-decompiler.com/flash/download/)
- [Flash Player Standalone Debugger](https://www.adobe.com/support/flashplayer/debug_downloads.html) and extract `flashplayerdebugger` in `bin` folder

#### Inject Core.swf
1. Download [Core.swf](http://203.104.209.71/kcs/Core.swf) from any Kancolle server
2. Launch FFDec, go to settings -> Advance Settings -> Paths -> Flex SDK directory path point path to any existing empty folder
3. Go to `%AppData%\Macromedia\Flash Player\macromedia.com\support\flashplayer\sys` (windows)
`~/Macromedia/Flash_Player/macromedia.com/support/flashplayer/sys` (linux)
and paste `settings.sol` inside.
This allows any swf file to make http request from your machine.
If you are concerned about flash security, please [configure](https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html) flash player to trust `bin/Core.swf`
4. Open command line, go to this repo inside `build`, and run `inject-core.bat <path-core-swf> <path-ffdec>` replace `<path-core-swf>` with absolute path to `Core.swf` and `<path-ffdec>` with absolute path to FFDec.
For example `local-dev.bat "C:\Core.swf" "C:\Program Files\FFDec"`.
Injected `Core.swf` will appear inside the `bin` folder.

#### Install Application's dependencies
```
npm install
```

#### Starting Application
If you don't have [pm2](https://www.npmjs.com/package/pm2), please install
```
npm install -g pm2
```
Run
```
pm2 start process.yml
```

## Testing
You have to set environment variables first before testing
```
PORT=5000 ETIMEOUT=5000 FLASH_PLAYER=bin/flashplayerdebugger KANCOLLE_CORE_SWF=bin/Core.swf TIMEZONE=Asia/Tokyo DEBUG=modcolle:* npm run test
```

## Environment Variables
Can be configured inside `process.yml`

- `PORT` exposed port number
- `ETIMEOUT` operation timeout in milliseconds
- `FLASH_PLAYER` path to flashplayer
- `KANCOLLE_CORE_SWF` path to decoded and injected `Core.swf`
- `TIMEZONE` [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)
- `DEBUG` shows debug info according to npm [debug](https://www.npmjs.com/package/debug) package
