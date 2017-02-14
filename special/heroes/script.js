requirejs.config({
  paths: {
    jquery: '../../shared/base/jquery/jquery.amd',
    lodash: '../../shared/base/lodash/lodash.amd',
    utils: '../../shared/base/utils/utils.amd',

    header: '../../shared/base/header/header.amd',
    svgLoaderLib: '../../shared/base/svg-loader/svg-loader-lib.amd',
    svgLoader: '../../shared/base/svg-loader/svg-loader.amd'
  },
  config: {
    text: {
      useXhr: function () {
        'use strict';

        return true;
      }
    }
  },
  waitSeconds: 100
});

require([

  'jquery',
  'lodash',
  'utils',

  'header',
  'svgLoaderLib',
  'svgLoader'


], function ($, _) {
  'use strict';

  $(function () {

    var modules,
      modulesCalled;

    modules = window.requirejs.s.contexts._.defined; // returns all modules that have been defined
    modulesCalled = _.uniq(CHAMP.blocks); // remove module duplicates

    Array.prototype.forEach.call(modulesCalled, function (module, idx) {
      var name,
        moduleDefined;

      name = typeof module === 'string' ? module : module.name;
      moduleDefined = modules[name];

      if (!moduleDefined) {
        console.log('module ' + name + ' is called, but not defined');

        return false;
      }

      try {
        moduleDefined.init();
      } catch (e) {
        console.log(idx, name, e);
      }
    });
  });
});
