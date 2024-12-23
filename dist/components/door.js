"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoorComponent = void 0;
var index_1 = require("rxjs/index");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var open_close_state_1 = require("../capabilities/open-close-state");
var component_1 = require("./component");
var DoorComponent = /** @class */ (function (_super) {
    __extends(DoorComponent, _super);
    function DoorComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (door) {
            _this.loxoneRequest.watchComponent(door['states']['active']).subscribe(function (event) {
                _this.opened = event === 1 ? true : false;
                _this.statesEvents.next(_this);
            });
        });
        return _this;
    }
    DoorComponent.prototype.getCapabilities = function () {
        return [
            open_close_state_1.OpenCloseStateHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE,
        ];
    };
    DoorComponent.prototype.getState = function () {
        return (0, index_1.of)((this.opened) ? 100 : 0);
    };
    return DoorComponent;
}(component_1.Component));
exports.DoorComponent = DoorComponent;
//# sourceMappingURL=door.js.map