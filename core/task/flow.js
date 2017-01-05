'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;
const NPM = require('reliable-npm').NPM;
const reliableGit = require('reliable-git');
const spawn = require('child_process').spawn;
const Builder = require('reliable-build');

const _ = require('../../common/helper');
const Channel = require('../slave/channel');
const logger = require('../../common/logger');
const getServerInfo = require('../server/monitor');

// Set the npm repo
const npm = new NPM();

const status = {
  ACK: 'ack',
  AVAILABLE: 'available',
  BUSY: 'busy'
};

const bodyStatus = {
  SUCCESS: 2,
  FAILED: 3
};

const type = {
  ACK: 'ack',
  TASK: 'task'
};

const setSlaveAvailable = () => { global.__task_status = status.AVAILABLE; };

/**
 * Process the task and send the result back when finished
 * @param msg
 */
module.exports = function *(msg, options) {

  const channel = Channel.getInstance();
  const basicData = {
    type: type.TASK,
    taskId: msg.taskId
  };

  let gitResult = '';

  function taskEnd(code = 0) {
    // Change the status to available after the task.
    setSlaveAvailable();

    const runnerStatus = code === 0 ?
      bodyStatus.SUCCESS :
      bodyStatus.FAILED;

    const extra = code === 0 ?
      {} :
      { description: gitResult };

    const result = _.merge(basicData, {
      sysInfo: getServerInfo(),
      status: status.AVAILABLE,
      bodyStatus: runnerStatus,
      extra,
      body: 'false'
    });

    logger.debug('Task is end with %s data...', msg.taskId);

    channel.send(result);
  }

  function envFromServer(env = '') {
    const result = {};

    env && env.split(',').forEach(e => {
      const [key, value] = e.split('=');
      result[key] = value;
    });

    return result;
  }

  try {
    // Create the temp directory according to taskId
    const tempDir = path.join(__dirname, '..', '..', '.temp', msg.taskId);
    options.path = tempDir;
    options.taskId = msg.taskId;

    if (fs.existsSync(tempDir)) {
      _.rimraf(tempDir);
    }
    _.mkdir(tempDir);

    logger.debug('Task %s start git clone...', msg.taskId);
    // Git clone the repo
    const [repo, branch, env] = msg.body.trim().split('#');
    const environment = envFromServer(env);
    options.env = environment;

    const gitRepo = yield Promise.race([
      reliableGit.clone({
        repo,
        branch,
        dir: tempDir
      }),
      _.timeoutPromise(600, 'Git clone timeout for 10mins')
    ]);

    gitResult = yield gitRepo.latestCommitInfo();

    logger.debug('Task %s start git clone success!', msg.taskId);

    // get build.sh path
    const builder = new Builder(options);
    const filePath = yield builder.build();
    const command = spawn('sh', [filePath]);

    command.stdout.setEncoding('utf8');
    command.stderr.setEncoding('utf8');

    command.stdout.on('data', data => {
      logger.debug('Sending %s data ...', msg.taskId);

      data += EOL;

      const result = _.merge(basicData, {
        sysInfo: getServerInfo(),
        status: status.BUSY,
        body: data
      });

      channel.send(result);
    });

    command.stderr.on('data', data => {
      logger.debug('Sending %s data ...', msg.taskId);

      data += EOL;

      const result = _.merge(basicData, {
        sysInfo: getServerInfo(),
        status: status.BUSY,
        body: data
      });

      channel.send(result);
    });

    command.on('close', code => {
      taskEnd(code);
    });

    command.on('error', err => {
      err += EOL;

      logger.debug('Sending %s error data...', msg.taskId);

      const result = _.merge(basicData, {
        sysInfo: getServerInfo(),
        status: status.BUSY,
        body: data
      });

      channel.send(result);

      taskEnd(1);
    });
  } catch (e) {
    setSlaveAvailable();

    logger.warn(e.stack);

    // Send the error data back to the server
    const execResult = e.toString().trim();

    const data = _.merge(basicData, {
      sysInfo: getServerInfo(),
      status: status.BUSY,
      body: execResult
    });

    logger.debug('Sending %s error data...', msg.taskId);

    channel.send(data);

    taskEnd(1);

    logger.debug('Done task %s data...', msg.taskId);

    setTimeout(() => {
      channel.send(data);
    }, 3000);
  }
};
