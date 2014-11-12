/**
 *
 * Created by uur on 12/10/14.
 */

var Promise = require("bluebird");

// 5 Minute Margin!
var PushScheduleMargin = 2 * 60 * 1000;
// 14 Day End!
var PushDeadlineTime = 14 * 24 * 60 * 60 * 1000;

var providers = {
    "PARSE": require("./provider/parse-provider")
};

/**
 *
 * @param {string} provider - Push provider name
 * @param {object} credentials - Credentials contains authKey and authSecret
 * @return {MechanicPush}
 * @constructor
 */
function MechanicPush(provider, credentials) {

    if (!(this instanceof MechanicPush)) {
        return new MechanicPush(provider, credentials);
    }

    if (!providers[provider]) {
        throw new Error("Push provider not defined: " + provider);
    }

    if (!credentials) {
        throw new Error("Credentials must be defined");
    }

    if (!credentials[provider.toLowerCase()]) {
        throw new Error("Credentials must be defined for " + provider);
    }

    this.provider = new providers[provider](credentials[provider.toLowerCase()]);
}

/**
 * @param {string[]} dstTokens - destination tokens
 * @param {string} pushText
 * @param {string} [later] - date object with UTC timestamp UTC+0
 * @return {Promise}
 */
MechanicPush.prototype.sendPush = function (dstTokens, pushText, later) {
    var self = this;
    return Promise.try(function () {
        pushText = self._pushTextCheck(pushText);
        if (later) {
            later = self._pushDateCheck(later);
        }
        return self.provider.sendPush(dstTokens, pushText, later);
    });
};

/**
 * @param {string} pushText
 * @param {string} [later] - date object with UTC timestamp UTC+0
 * @return {Promise}
 */
MechanicPush.prototype.sendBroadcast = function (pushText, later) {
    var self = this;
    return Promise.try(function () {
        pushText = self._pushTextCheck(pushText);
        if (later) {
            later = self._pushDateCheck(later);
        }
        return self.provider.sendBroadcast(pushText, later);
    });
};

/**
 * @param later
 * @return {string} - checked and may altered date or raise an error
 * @private
 */
MechanicPush.prototype._pushDateCheck = function (later) {

    var now = Date.now();

    if (later <= (now + PushScheduleMargin)) {
        throw new Error("Push messages can not be scheduled into past or immediate future ( try 2 minute margin )");
    }
    else if (later >= PushDeadlineTime + now) {
        throw new Error("Push messages can not be scheduled into far future and must be within 2 weeks");
    }
    return later;
};

/**
 * @param pushText
 * @return {string} - checked and may altered push text or raise an error
 * @private
 */
MechanicPush.prototype._pushTextCheck = function (pushText) {

    if (!(typeof pushText == "string" || pushText instanceof String)) {
        throw new Error("Push text must be string: " + pushText);
    }

    if (pushText.length >= 90) {
        // Best in class must be max 90 char
        throw new Error("Push text length should be smaller than 90 character: " + pushText);
    }

    return pushText;
};

module.exports = MechanicPush;