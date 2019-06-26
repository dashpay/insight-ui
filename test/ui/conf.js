exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test.js'],

    multiCapabilities: [

        {
            browserName: 'firefox',
        },
        {
            // chromeOptions: {
            //     args: [ "--headless" ]
            // },
            browserName: 'chrome'
        }
    ],
    // plugins: [{
    //     package: 'protractor-screenshoter-plugin',
    //     screenshotPath: './screenshots',
    //     screenshotOnExpect: 'failure+success',
    //     screenshotOnSpec: 'none',
    //     withLogs: true,
    //     writeReportFreq: 'asap',
    //     imageToAscii: 'none',
    //     clearFoldersBeforeTest: true
    // }],
    //
    // onPrepare: function() {
    //     // returning the promise makes protractor wait for the reporter config before executing tests
    //     return global.browser.getProcessedConfig().then(function(config) {
    //         //it is ok to be empty
    //     });
    // }
};
