/** internal
 *  mixin Engines
 *
 *  `Engines` provides a global and [[Environment]] instance registry.
 *
 *  An engine is a type of processor that is bound to an filename
 *  extension. `application.js.coffee` indicates that the
 *  `CoffeeScriptTemplate` engine will be ran on the file.
 *
 *  Extensions can be stacked and will be evaulated from right to
 *  left. `application.js.coffee.ejs` will first run `EJSTemplate`
 *  then `CoffeeScriptTemplate`.
 *
 *  All `Engine`s must follow the [[EngineTemplate]] interface. It is
 *  recommended to subclass [[EngineTemplate]].
 *
 *  Its recommended that you register engine changes on your local
 *  `Environment` instance.
 *
 *      environment.registerEngine('.foo', FooProcessor)
 *
 *  The global registry is exposed for plugins to register themselves.
 *
 *      Mincer.registerEngine('.sass', SassProcessor)
 **/


'use strict';


// 3rd-party
var _ = require('underscore');


// internal
var getter = require('../common').getter;
var normalizeExtension = require('../common').normalizeExtension;


/**
 *  Engines#engines(ext) -> Object|Function
 *
 *  Returns an `Object` map of `extension => Engine`s registered on the
 *  `Environment`. If an `ext` argument is supplied, the `Engine` register
 *  under that extension will be returned.
 *
 *      environment.engines()
 *      // -> { ".coffee": CoffeeScriptTemplate, ... }
 *
 *      environment.engines('.coffee')
 *      // -> CoffeeScriptTemplate
 **/
module.exports.engines = function (ext) {
  if (!!ext) {
    return this.__engines__[normalizeExtension(ext)];
  } else {
    return _.clone(this.__engines__);
  }
};


/**
 *  Engines#engineExtensions -> Array
 *
 *  Returns an `Array` of engine extension `String`s.
 *
 *      environment.engineExtensions;
 *      // -> ['.coffee', '.sass', ...]
 **/
getter(module.exports, 'engineExtensions', function () {
  return _.keys(this.__engines__);
});


/**
 *  Engines#registerEngine(ext, klass) -> Void
 *
 *  Registers a new Engine `klass` for `ext`. If the `ext` already
 *  has an engine registered, it will be overridden.
 *
 *      environment.registerEngine('.coffee', CoffeeScriptTemplate);
 **/
module.exports.registerEngine = function (ext, klass) {
  this.__engines__[normalizeExtension(ext)] = klass;
};