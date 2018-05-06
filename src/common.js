/**
 * The common bootstrapper for background and content script.
 */
"use strict";

/**
 * The main namespace. Different methods will be added to this namespace
 * depending on the execution context.
 * @var {Namespace}
 */
var a = {};

a.isFirefox = true;
a.debugMode = false;
