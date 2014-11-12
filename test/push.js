/**
 *
 * Created by uur on 12/10/14.
 */

var MechanicPush = require("../lib/mechanic-push");

var expect = require("chai").expect;
var credentials;
var mechanicPush;

describe("Mechanic Push Test", function () {

    var provider = "PARSE";

    describe("Not Valid Parameters", function () {
        it("should fail with no credentials", function () {
            expect(function () {
                new MechanicPush(provider, credentials);
            }).to.throw(Error);
        });

        it("should fail without credentials for provider or invalid credentials data", function () {
            expect(function () {
                new MechanicPush(provider);
            }).to.throw(Error);
            expect(function () {
                new MechanicPush(provider, {
                    "parse": {
                        "XX": "*******",
                        "YY": "*******"
                    }
                });
            }).to.throw(Error);
        });

        it("should fail with not valid provider name", function () {
            expect(function () {
                new MechanicPush("*****", {
                    "parse": {
                        "XX": "*******",
                        "YY": "*******"
                    }
                });
            }).to.throw(Error);
        });
    });

    describe("Valid Credentials", function () {
        var msgToSend = "da";

        before(function (done) {
            try {
                credentials = require("./credentials.json");
                mechanicPush = new MechanicPush(provider, credentials);
                done();
            }
            catch (error) {
                done(error);
            }
        });

        it("should do what for empty list", function (done) {
            mechanicPush.sendBroadcast(msgToSend, Date.now() + 2*60*1001).then(function () {
                done();
            }).catch(function (error) {
                console.log("-----" , error);
                done(error);
            });
        });

    });
});