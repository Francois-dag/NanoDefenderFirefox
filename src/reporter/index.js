/**
 * Script for quick issue reporter.
 */
"use strict";


/**
 * The key for local storage.
 * @const {string}
 */
const storageKeyLastReport = "quick-issue-reporter-last-report";
/**
 * The time in milliseconds the user must wait between sending two messages.
 * @const {number}
 */
const rateLimit = 900000;

/**
 * The number of characters the details field can contain.
 * @const {number}
 */
const detailsLimit = 4096;
/**
 * Update the character count.
 * @function
 * @listens input
 */
const updateDetailsLimit = () => {
    const length = $("#details").prop("value").length;

    $("#character-count").text(
        length.toString() + "/" + detailsLimit.toString(),
    );

    if (length > detailsLimit) {
        $("#character-count").addClass("red");
    } else {
        $("#character-count").rmClass("red");
    }
};

/**
 * The name of the host app.
 * @const {string}
 */
const appName = (() => {
    const manifest = chrome.runtime.getManifest();
    return manifest.name + " " + manifest.version;
})();


$("#details").on("input", updateDetailsLimit);
updateDetailsLimit();

$("#send").on("click", async () => {
    const category = $("#category").prop("value");
    const url = $("#url").prop("value");
    const details = $("#details").prop("value");

    if (!category) {
        $("#msg-specific-error p").text("You must choose a category.");
        $("#msg-specific-error").addClass("open");
        return;
    }
    if (!url) {
        $("#msg-specific-error p").text("You must fill the URL field.");
        $("#msg-specific-error").addClass("open");
        return;
    }
    if (details.length > detailsLimit) {
        $("#msg-specific-error p").text("Additional details can be at most "
            + detailsLimit.toString() + " characters long.");
        $("#msg-specific-error").addClass("open");
        return;
    }

    let response
    try {
        response = await post(
            "send\n" +
            "Quick Issue Reporter\n" +
            navigator.userAgent + "\n" +
            appName + "\n" +
            "\n" +
            "[" + category + "] " + url + "\n" +
            details
        );
    } catch (e) {
        $("#msg-generic-error").addClass("open");
        return;
    }

    if (response === "ok") {
        localStorage.setItem(storageKeyLastReport, Date.now());
        $("#msg-report-sent").addClass("open");
    } else {
        console.error(response);
        $("#msg-generic-error").addClass("open");
    }
});

$("#msg-generic-error button").on("click", () => {
    $("#msg-generic-error").rmClass("open");
});
$("#msg-specific-error button").on("click", () => {
    $("#msg-specific-error").rmClass("open");
});

{
    const init = () => {
        const lastReport = localStorage.getItem(storageKeyLastReport);
        const now = Date.now();
        if (typeof lastReport === "number" && lastReport + rateLimit > now) {
            $("#msg-rate-limited").addClass("open");
        } else {
            $("#main").rmClass("hidden");
        }
    };

    if (/^\?\d+$/.test(location.search)) {
        chrome.tabs.get(parseInt(location.search.substring(1)), (tab) => {
            if (!chrome.runtime.lastError) {
                $("#url").prop("value", tab.url);
            }
            init();
        });
    } else {
        init();
    }
}
