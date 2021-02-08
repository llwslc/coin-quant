const { exec } = require('child_process');
const schedule = require('node-schedule');
const log4js = require('log4js');

const logger = log4js.getLogger('spider');
logger.level = 'info';

logger.info(`Spider Run!`);

schedule.scheduleJob('10 9 * * *', () => {
  exec('node dklines', (error, stdout, stderr) => {
    if (error) {
      logger.error(`[dklines] Error: ${error}`);
      return;
    }
    if (stderr) {
      logger.error(`[dklines] Stderr: ${stderr}`);
      return;
    }
    logger.info(`[dklines]: Success`);
  });
});

schedule.scheduleJob('10 10 * * *', () => {
  exec('sh dbBackup.sh', (error, stdout, stderr) => {
    if (error) {
      logger.error(`[dbBackUp] Error: ${error}`);
      return;
    }
    if (stderr) {
      logger.error(`[dbBackUp] Stderr: ${stderr}`);
      return;
    }
    logger.info(`[dbBackUp]: Success`);
  });
});
