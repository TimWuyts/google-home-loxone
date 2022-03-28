"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0 = void 0;
var rx_http_request_1 = require("@akanass/rx-http-request");
var of_1 = require("rxjs/internal/observable/of");
var operators_1 = require("rxjs/operators");
var Auth0 = /** @class */ (function () {
    function Auth0(config) {
        this.oAuthUrl = config.oAuthUrl;
        this.authorizedEmails = config.authorizedEmails;
        this.testMode = config.testMode;
    }
    Auth0.prototype.checkUser = function (token) {
        var url = "".concat(this.oAuthUrl, "/userinfo/");
        return rx_http_request_1.RxHR.get(url, {
            gzip: true,
            headers: {
                authorization: 'Bearer ' + token
            }
        });
    };
    Auth0.prototype.checkToken = function (request) {
        var _this = this;
        var token = request.headers.authorization ?
            request.headers.authorization.split(' ')[1] : null;
        if (this.testMode && token === 'access-token-from-skill') {
            return (0, of_1.of)(true);
        }
        return this.checkUser(token).pipe((0, operators_1.map)(function (result) {
            if (result.response.statusCode === 200) {
                var user = JSON.parse(result.response.body);
                return _this.authorizedEmails.indexOf(user.email) > -1;
            }
            return false;
        }, (0, operators_1.catchError)(function () { return (0, of_1.of)(false); })));
    };
    return Auth0;
}());
exports.Auth0 = Auth0;
//# sourceMappingURL=auth.js.map