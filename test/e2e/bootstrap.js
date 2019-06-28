// const path = require('path');
// const dotenvSafe = require('dotenv-safe');
// const dotenvExpand = require('dotenv-expand');
// const { expect, use } = require('chai');
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// const dirtyChai = require('dirty-chai');
// const chaiAsPromised = require('chai-as-promised');
const InsightUIOptions = require('../../lib/test/helpers/container/InsightUIOptions');
// const DashApiOptions = require('@dashevo/dp-services-ctl/lib/services/driveApi/DriveApiOptions');
// const DashSyncOptions = require('@dashevo/dp-services-ctl/lib/services/driveSync/DriveSyncOptions');
// const DapiCoreOptions = require('@dashevo/dp-services-ctl/lib/services/dapi/core/DapiCoreOptions');
// const DapiTxFilterStreamOptions = require('@dashevo/dp-services-ctl/lib/services/dapi/txFilterStream/DapiTxFilterStreamOptions');
// const DashCoreOptions = require('@dashevo/dp-services-ctl/lib/services/dashCore/DashCoreOptions');
// const InsightApiOptions = require('@dashevo/dp-services-ctl/lib/services/insightApi/InsightApiOptions');

// use(sinonChai);
// use(chaiAsPromised);
// use(dirtyChai);

// process.env.NODE_ENV = 'test';

// const dotenvConfig = dotenvSafe.config({
//     path: path.resolve(__dirname, '..', '..', '.env'),
// });
// dotenvExpand(dotenvConfig);

const rootPath = process.cwd();

const insightUIContainerOptions = {
    throwErrorsFromLog: true,
    volumes: [
        `${rootPath}/:/insight/node_modules/@dashevo/insight-ui/`,
        // `${rootPath}/tesy:/usr/src/app/scripts`,
    ],
};

// if (process.env.SERVICE_IMAGE_DRIVE) {
//     Object.assign(driveContainerOptions, {
//         image: process.env.SERVICE_IMAGE_DRIVE,
//     });
// }

const driveOptions = {
    cacheNodeModules: true,
    localAppPath: rootPath,
    container: insightUIContainerOptions,
};

InsightUIOptions.setDefaultCustomOptions(driveOptions);
// DashSyncOptions.setDefaultCustomOptions(driveOptions);
//
// if (process.env.SERVICE_IMAGE_CORE) {
//     DashCoreOptions.setDefaultCustomOptions({
//         container: {
//             image: process.env.SERVICE_IMAGE_CORE,
//         },
//     });
// }
//
// if (process.env.SERVICE_IMAGE_DAPI) {
//     DapiCoreOptions.setDefaultCustomOptions({
//         container: {
//             image: process.env.SERVICE_IMAGE_DAPI,
//         },
//     });
//
//     DapiTxFilterStreamOptions.setDefaultCustomOptions({
//         container: {
//             image: process.env.SERVICE_IMAGE_DAPI,
//         },
//     });
// }

// if (process.env.SERVICE_IMAGE_INSIGHT) {
//     InsightApiOptions.setDefaultCustomOptions({
//         container: {
//             image: process.env.SERVICE_IMAGE_INSIGHT,
//         },
//     });
// }
//
// beforeEach(function beforeEach() {
//     if (!this.sinon) {
//         this.sinon = sinon.createSandbox();
//     } else {
//         this.sinon.restore();
//     }
// });
//
// afterEach(function afterEach() {
//     this.sinon.restore();
// });

global.expect = expect;
