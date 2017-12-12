// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    var configuration = {
        frameworks   : ['jasmine', '@angular/cli'],
        plugins      : [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('@angular/cli/plugins/karma'),
            require('karma-spec-reporter'),
            require('karma-coverage-istanbul-reporter')
        ],
        files        : [
            {pattern: './test.ts', watched: false}
        ],
        preprocessors: {
            './test.ts': ['@angular/cli']
        },
        mime         : {
            'text/x-typescript': ['ts', 'tsx']
        },
        angularCli   : {
            config     : './.angular-cli.json',
            environment: 'test'
        },
        reporters    : ["spec"],
        specReporter : {
            maxLogLines         : 5,         // limit number of lines logged per test
            suppressErrorSummary: false,  // do not print error summary
            suppressFailed      : false,  // do not print information about failed tests
            suppressPassed      : false,  // do not print information about passed tests
            suppressSkipped     : false,  // do not print information about skipped tests
            showSpecTiming      : true // print the time elapsed for each spec
        },
        basePath     : '',
        port         : 9876,
        colors       : true,
        logLevel     : config.LOG_INFO,
        autoWatch    : true,
        browsers     : ['Chrome'],
        singleRun    : false,
        client       : {
            captureConsole: true
        },
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        browserNoActivityTimeout: 50000
    };
    if(process.env.TRAVIS){
        configuration.browsers = ['Chrome_travis_ci'];
        // configuration.reporters = configuration.reporters.concat(['coverage', 'coveralls']);
        // configuration.coverageReporter = {
        //   type : 'lcovonly',
        //   dir : 'coverage/'
        // };
    }
    config.set(configuration);
};
