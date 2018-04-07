/**
 * The common bootstrapper for background and content script.
 */
"use strict";

/**
 * The main namespace. Different methods will be added to this namespace depending on
 * the execution context.
 * @var {Namespace}
 */
var a = {};

/**
 * Whether current browser is Firefox.
 * @const {boolean}
 */
a.isFirefox = false;
/**
 * Whether current browser is Edge.
 * @const {boolean}
 */
a.isEdge = false;

//@pragma-if-debug
/**
 * Whether the extension is loaded in debug mode.
 * The compiler is responsible in hard coding this switch.
 * @const {boolean}
 */
a.debugMode = true;
//@pragma-end-if

a.isFirefox = true;
a.debugMode = false;
