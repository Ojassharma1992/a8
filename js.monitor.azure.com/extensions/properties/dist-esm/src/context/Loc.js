/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Loc.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
var Loc = /** @class */ (function() {
    function Loc() {
        // Add time zone
        var timeZone = new Date().getTimezoneOffset();
        var minutes = timeZone % 60;
        var hours = (timeZone - minutes) / 60;
        var timeZonePrefix = "+";
        if (hours > 0) {
            timeZonePrefix = "-";
        }
        hours = Math.abs(hours);
        minutes = Math.abs(minutes);
        this.tz = timeZonePrefix + (hours < 10 ? "0" + hours : hours.toString()) + ":" +
            (minutes < 10 ? "0" + minutes : minutes.toString());
    }
    return Loc;
}());
export {
    Loc
};
//# sourceMappingURL=Loc.js.map