System.register(['@angular/platform-browser-dynamic', '@angular/core', './test/angular-test.component', './test/environment'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, core_1, angular_test_component_1, environment_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (angular_test_component_1_1) {
                angular_test_component_1 = angular_test_component_1_1;
            },
            function (environment_1_1) {
                environment_1 = environment_1_1;
            }],
        execute: function() {
            if (environment_1.environment.production) {
                core_1.enableProdMode();
            }
            platform_browser_dynamic_1.bootstrap(angular_test_component_1.AngularTestAppComponent);
        }
    }
});
