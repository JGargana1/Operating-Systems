/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        currentFont;
        currentFontSize;
        currentXPosition;
        currentYPosition;
        buffer;
        lines = [];
        commandHistory = [];
        commandHistoryIndex = -1;
        commandStartXPosition = 0;
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "") {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        init() {
            this.clearScreen();
            this.resetXY();
            this.commandStartXPosition = 0;
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        putPrompt() {
            this.advanceLine();
            this.putText(_OsShell.promptStr);
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    if (this.buffer !== "") {
                        this.commandHistory.push(this.buffer);
                        this.commandHistoryIndex = this.commandHistory.length;
                    }
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    this.commandStartXPosition = 0; // Reset the command start position here
                    this.putPrompt();
                }
                else if (chr === String.fromCharCode(8)) { // the Backspace key
                    this.removeLastCharacter();
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            if (text !== "") {
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition += offset;
                if (this.lines.length === 0) {
                    this.lines.push(text);
                }
                else {
                    this.lines[this.lines.length - 1] += text;
                }
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // If we are about to go off screen
            if (this.currentYPosition > _Canvas.height) {
                // Move the 'camera' up by one line height
                this.lines.shift();
                this.redrawConsole();
                this.currentYPosition -= (_DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin); // Adjust this to match your line height
            }
            this.lines.push(""); // Add a new line to the lines array
            this.buffer = ""; // Clear the buffer as we have advanced to a new line
            this.commandStartXPosition = 0; // Reset the command start position to the beginning of the line
        }
        redrawConsole() {
            this.clearScreen(); // Clear the screen
            // Reset the Y position
            this.currentYPosition = this.currentFontSize;
            // Redraw each line without calling advanceLine()
            for (let line of this.lines) {
                this.currentXPosition = 0;
                this.putTextWithoutAdvancing(line);
                this.currentYPosition += _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
            }
            // Set the X position based on the length of the last line to allow continuous typing
            this.currentXPosition = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.lines[this.lines.length - 1]);
        }
        putTextWithoutAdvancing(text) {
            if (text !== "") {
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition += offset;
            }
            // this.currentXPosition = 0;  // We remove this line to maintain the X position across redraws
        }
        removeLastCharacter() {
            if (this.buffer.length > 0) {
                // Get the last character from the buffer
                var removedChar = this.buffer.charAt(this.buffer.length - 1);
                // Remove the last character from the buffer
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                // Recalculate the current X position by "rewinding" the addition of the last character
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, removedChar);
                this.currentXPosition -= offset;
                // Clear the last character from the canvas
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, offset, this.currentFontSize + _FontHeightMargin);
            }
            if (this.lines.length > 0) {
                this.lines[this.lines.length - 1] = this.buffer;
            }
        }
        autoComplete() {
            // Get the list of valid command names from the shell
            const validCommands = _OsShell.getCommandNames();
            // Find commands that start with the current buffer
            const matches = validCommands.filter(cmd => cmd.startsWith(this.buffer));
            if (matches.length > 0) {
                // If there are matches, complete the buffer with the first match
                this.buffer = matches[0];
                // Clear the current line
                _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, _Canvas.width, this.currentFontSize + _FontHeightMargin);
                // Reset X position and draw the buffer
                this.currentXPosition = 0;
                this.putText(this.buffer);
            }
            if (this.lines.length > 0) {
                this.lines[this.lines.length - 1] = this.buffer;
            }
        }
        navigateCommandHistory(offset) {
            // Adjust the command history index
            this.commandHistoryIndex = Math.min(Math.max(this.commandHistoryIndex + offset, 0), this.commandHistory.length - 1);
            // Get the command from the history
            const command = this.commandHistory[this.commandHistoryIndex];
            // Clear the current line
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, _Canvas.width, this.currentFontSize + _FontHeightMargin);
            // Reset X position and draw the command from history
            this.currentXPosition = 0;
            this.putText(command);
            // Set the buffer to the command from history
            this.buffer = command;
            if (this.lines.length > 0) {
                this.lines[this.lines.length - 1] = this.buffer;
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map