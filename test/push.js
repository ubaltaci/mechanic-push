/**
 *
 * Created by uur on 12/10/14.
 */

var MechanicPush = require("../lib/mechanic-push");

var expect = require("chai").expect;
var credentials;
var mechanicPush;

describe("Mechanic Push:", function () {

    var provider = "PARSE";

    describe("Invalid Credentials:", function () {
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
                    "UnknownProvider": {}
                });
            }).to.throw(Error);
        });

        it("should fail with not valid provider name", function () {
            expect(function () {
                new MechanicPush("*****", {
                    "parse": {
                        "NOTappId": "*******",
                        "NOTrestApiKey": "*******"
                    }
                });
            }).to.throw(Error);
        });
    });

    describe("Valid Credentials:", function () {
        var msgToSend = "MSG";

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

        it("Invalid Push Id should throw error", function (done) {
            mechanicPush.sendBroadcast(1, msgToSend, Date.now() + 2*60*1001).then(function () {
                done("Should not be executed");
            }).catch(function (error) {
                expect(error).to.exist();
                done();
            });
        });

        it("Past later date should throw error", function (done) {
            mechanicPush.sendBroadcast("1", msgToSend, Date.now() - 2*60*1001).then(function () {
                done("Should not be executed");
            }).catch(function (error) {
                expect(error).to.exist();
                done();
            });
        });

        it("Immediate later date should throw error", function (done) {
            mechanicPush.sendBroadcast("1", msgToSend, Date.now() + 1001).then(function () {
                done("Should not be executed");
            }).catch(function (error) {
                expect(error).to.exist();
                done();
            });
        });

        it("Far later date should throw error", function (done) {
            mechanicPush.sendBroadcast("1", msgToSend, Date.now() + 14*24*60*60*1001).then(function () {
                done("Should not be executed");
            }).catch(function (error) {
                expect(error).to.exist();
                done();
            });
        });

        it("Should send push immediately", function (done) {
            mechanicPush.sendBroadcast("1", msgToSend).then(function () {
                done();
            }).catch(function (error) {
                expect(error).to.not.exist();
                done(error);
            });
        });

        it("Should send push for 3 minutes later", function (done) {
            mechanicPush.sendBroadcast("1", msgToSend, Date.now() + 3*60*1000).then(function () {
                done();
            }).catch(function (error) {
                expect(error).to.not.exist();
                done(error);
            });
        });

        it("Should send listed tokens immediately", function (done) {
            mechanicPush.sendPush("1", msgToSend + " individual token", ["9a3693623660837ea8fd75167288802b1697d4d33ffef8ec31452ad605217477"]).then(function () {
                done();
            }).catch(function (error) {
                console.log(error);

                expect(error).to.not.exist();
                done(error);
            });
        });

        it("Should send listed tokens 3 minutes later", function (done) {
            mechanicPush.sendPush("1", msgToSend + " individual token", ["9a3693623660837ea8fd75167288802b1697d4d33ffef8ec31452ad605217477"], Date.now() + 3*60*1000).then(function () {
                done();
            }).catch(function (error) {
                console.log(error);

                expect(error).to.not.exist();
                done(error);
            });
        });

    });
});