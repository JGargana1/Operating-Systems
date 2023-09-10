/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) || // digits
                (keyCode == 32) || // space
                (keyCode == 13)) { // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (isShifted && keyCode >= 186 && keyCode <= 222) {
                // Handle shifted symbols
                switch (keyCode) {
                    case 186:
                        chr = ":";
                        break;
                    case 187:
                        chr = "+";
                        break;
                    case 188:
                        chr = "<";
                        break;
                    case 189:
                        chr = "_";
                        break;
                    case 190:
                        chr = ">";
                        break;
                    case 191:
                        chr = "?";
                        break;
                    case 192:
                        chr = "~";
                        break;
                    case 219:
                        chr = "{";
                        break;
                    case 220:
                        chr = "|";
                        break;
                    case 221:
                        chr = "}";
                        break;
                    case 222:
                        chr = "\"";
                        break;
                    default: break;
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode >= 186 && keyCode <= 222) {
                // Handle non-shifted symbols
                switch (keyCode) {
                    case 186:
                        chr = ";";
                        break;
                    case 187:
                        chr = "=";
                        break;
                    case 188:
                        chr = ",";
                        break;
                    case 189:
                        chr = "-";
                        break;
                    case 190:
                        chr = ".";
                        break;
                    case 191:
                        chr = "/";
                        break;
                    case 192:
                        chr = "`";
                        break;
                    case 219:
                        chr = "[";
                        break;
                    case 220:
                        chr = "\\";
                        break;
                    case 221:
                        chr = "]";
                        break;
                    case 222:
                        chr = "'";
                        break;
                    default: break;
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode === 8) { // Backspace
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode === 9) { // Tab key
                _Console.autoComplete();
            }
            else if (keyCode === 38) { // Up arrow key
                _Console.navigateCommandHistory(-1);
            }
            else if (keyCode === 40) { // Down arrow key
                _Console.navigateCommandHistory(1);
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map