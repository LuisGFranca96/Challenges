import { loggers } from 'winston';
import config from './config/vars';
import app from './config/express';
/* eslint-disable no-unused-vars */
import db from './server/models';

const debug = require('debug')('nodejs-api-boilerplate-api:index');
/* eslint-enable no-unused-vars */

// Get default logger
const logger = loggers.get(config.loggerName); // eslint-disable-line no-global-assign

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// module.parent check is required to support mocha watch
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        logger.info(`The application has started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
}

export default app;
