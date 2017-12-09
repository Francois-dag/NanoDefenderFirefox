/**
 * Content rules for debugging. Only run in debug mode.
 */
"use strict";

//@pragma-if-debug

//Tools
if (a.debugMode) {
    if (a.domCmp(["twitch.tv"], true)) {
        //Force Twitch to show debug logs
        a.readOnly("log", "window.console.log.bind(window.console)", "window.console");
        a.readOnly("warn", "window.console.warn.bind(window.console)", "window.console");
        a.readOnly("error", "window.console.error.bind(window.console)", "window.console");
    }
}

//Rules
if (a.debugMode) {
    if (a.domCmp(["fox.com"])) {
        //https://github.com/jspenguin2017/uBlockProtector/issues/660
        a.replaceXHR(() => {

            console.warn("[Nano] xhr", url);

            if (url.includes("uplynk.com/preplay")) {
                this.addEventListener("readystatechange", () => {
                    if (this.readyState === 4) {
                        try {

                            console.warn(this.responseText);

                            let payload = window.JSON.parse(this.responseText);
                            payload.ads = {};
                            replace(this, window.JSON.stringify(payload));
                        } catch (err) { }
                    }
                });
            }
        });
        a.inject(() => {
            "use strict";
            const _fetch = window.fetch;
            window.fetch = (...args) => {

                console.warn("[Nano] fetch", args);

                return _fetch.apply(window, args);
            };
        });
    }
}

//@pragma-end-if
