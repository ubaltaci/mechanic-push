/**
 *
 * Created by uur on 13/10/14.
 */

var Promise = require("bluebird");
var Request = require("request");

var endpoint = "https://api.parse.com/1/push";

/**
 * Push Provider - Parse
 * @param {object} credentials - Credentials contains appId and clientKey
 * @return {ParseProvider}
 * @constructor
 */
function ParseProvider(credentials) {

    if (!(this instanceof ParseProvider)) {
        return new ParseProvider(credentials);
    }

    if (!credentials.appId || !credentials.restApiKey) {
        throw new Error("appId and restApiKey must be defined in credentials");
    }

    this.credentials = credentials;
}

/**
 * @param {string} pushId
 * @param {string} pushText
 * @param {string[]} dstTokens - destination device token or array of device tokens
 * @param {string} [later] - date object with UTC timestamp UTC+0
 * @return {Promise}
 */

ParseProvider.prototype.sendPush = function (pushId, pushText, dstTokens, later) {
    var body = {
        "where": {
            "deviceToken": {"$in": dstTokens}
        },
        "data": {
            "alert": pushText,
            "pushId": pushId
        }
    };

    if (later) {
        // Parse expects a push time in epoc time ( seconds )
        // Turn miliseconds -> seconds
        body["push_time"] = later / 1000;
    }

    return this._send(body);
};

/**
 * @param {string} pushText
 * @param {string} [later] - date object with UTC timestamp UTC+0
 * @return {Promise}
 */

ParseProvider.prototype.sendBroadcast = function (pushId, pushText, later) {
    var body = {
        "where": {},
        "data": {
            "alert": pushText,
            "pushId": pushId
        }
    };

    if (later) {
        // Parse expects a push time in epoc time ( seconds )
        // Turn miliseconds -> seconds
        body["push_time"] = later / 1000;
    }

    return this._send(body);
};

ParseProvider.prototype._send = function (body) {

    var self = this;

    return new Promise(function (resolve, reject) {
        Request.post({
            uri: endpoint,
            headers: {
                "X-Parse-Application-Id": self.credentials.appId,
                "X-Parse-REST-API-Key": self.credentials.restApiKey
            },
            body: body,
            json: true,
            timeout: 10000 // Defaults to 10sec
        }, function (error, response, body) {
            if (error) {
                return reject(new Error("Push server not available right now"));
            }
            else if (body.error) {
                return reject(new Error(body.error + " (" + body.code + ")"));
            }
            if (body.result) {
                resolve();
            }
        });
    });
};

module.exports = ParseProvider;

