/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        // Properties
        promptStr = ">";
        commandList = [];
        curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        apologies = "[sorry]";
        constructor() {
        }
        init() {
            this.initDateTimeUpdater();
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellTrap, "trap", "-Trigger a test kernel error");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates the user code in the HTML5 text area.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays where the user is currently located. (I know where you live)");
            this.commandList[this.commandList.length] = sc;
            // Lotto
            sc = new TSOS.ShellCommand(this.shellLotto, "lotto", "- Have the chance to win a million bucks.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Set the status message.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- run 'PID'");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- clears memory'");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- runs all programs in memory'");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- kill 'PID''");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "- kills all programs");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- quantum 'int' sets the quantum");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- Displays the PID and state of all processes");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        }
        getCommandNames() {
            return this.commandList.map(command => command.command);
        }
        initDateTimeUpdater() {
            const dateTimeDiv = document.getElementById('date-time');
            setInterval(() => {
                const now = new Date();
                dateTimeDiv.innerText = now.toLocaleString();
            }, 1000);
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Displays a list of available commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Displays the current version of the operating system.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but keeps the underlying simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Provides rot13 obfuscation on the given string.");
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the console prompt to the provided string. Usage: prompt <string>.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ". Type 'help' for a list of commands.");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>. Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate(args) {
            const currentDate = new Date();
            _StdOut.putText(currentDate.toLocaleString());
        }
        shellWhereAmI(args) {
            const locations = ["Mars", "The Matrix", "Marist", "In-between portals"];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            _StdOut.putText("Where you are curently standing: " + randomLocation);
        }
        shellLotto(args) {
            const lottos = [
                "You lose!",
                "You just won a million bucks! press alt + f4 to win!",
                "You lose!",
                "You lose! (you really suck at this)",
            ];
            const randomLotto = lottos[Math.floor(Math.random() * lottos.length)];
            _StdOut.putText(randomLotto);
        }
        shellStatus(args) {
            if (args.length > 0) {
                const statusMessage = args.join(' ');
                document.getElementById('status-display').innerText = 'Status: ' + statusMessage;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a status message.");
            }
        }
        shellTrap(args) {
            _Kernel.krnTrapError("Test trap command executed");
        }
        shellLoad = (args) => {
            const input = document.getElementById('taProgramInput').value;
            // Validate that the input is not empty and contains only valid hexadecimal characters.
            const isValid = /^[0-9A-Fa-f\s]+$/.test(input);
            if (!isValid) {
                if (input === "") {
                    _StdOut.putText("The input is empty.");
                }
                else {
                    _StdOut.putText("The input is invalid. Only hex digits and spaces are allowed.");
                }
                return;
            }
            const opCodes = input.split(/\s+/);
            if (opCodes.length > _Memory.segmentSize) {
                _StdOut.putText("The input exceeds the memory segment capacity.");
                return;
            }
            const freeSegment = _MemoryManager.findFreeSegment();
            if (freeSegment === -1) {
                _StdOut.putText("Sorry, all memory segments are full, please clear memory.");
                return;
            }
            let startingAddress = 0;
            const newProgram = new TSOS.Program(_PID, startingAddress, startingAddress + opCodes.length - 1, freeSegment);
            _Programs.push(newProgram);
            for (let i = 0; i < opCodes.length; i++) {
                _MemoryAccessor.write(freeSegment, startingAddress + i, opCodes[i]);
                _MemoryManager.setByteOccupied(freeSegment, startingAddress + i, true);
                console.log(`Loaded value ${opCodes[i]} to address ${startingAddress + i} in segment ${freeSegment}`);
            }
            _MemoryManager.assignSegmentToPID(_PID, freeSegment);
            _StdOut.putText(`Program loaded with PID: ${_PID} in segment ${freeSegment}`);
            this.createPCBDisplay(newProgram);
            _PID++;
        };
        createPCBDisplay(program) {
            const pcbContainer = document.getElementById("pcb-container");
            if (!pcbContainer) {
                return;
            }
            let pcbHtml = `
                <div class="pcb" id="pcb-${program.PID}">
                    <span class="pid-display">PID: <span class="pid-value">${program.PID}</span></span>
                    <span class="state-display">State: <span class="state-value">${program.state}</span></span>
                    <span class="pc-display">PC: <span class="pc-value">${program.PC}</span></span>
                    <span class="acc-display">ACC: <span class="acc-value">${program.ACC}</span></span>
                    <span class="xreg-display">Xreg: <span class="xreg-value">${program.Xreg}</span></span>
                    <span class="yreg-display">Yreg: <span class="yreg-value">${program.Yreg}</span></span>
                    <span class="zflag-display">Zflag: <span class="zflag-value">${program.Zflag}</span></span>
                </div>`;
            pcbContainer.innerHTML += pcbHtml;
        }
        shellRun(args) {
            if (args.length === 0) {
                _StdOut.putText("Please specify a PID to run.");
                return;
            }
            const pid = parseInt(args[0]);
            if (isNaN(pid)) {
                _StdOut.putText("Invalid PID. Please enter a numeric PID.");
                return;
            }
            const programToRun = _Programs.find(program => program.PID === pid);
            if (!programToRun) {
                _StdOut.putText(`No program with PID: ${pid} found.`);
                return;
            }
            if (programToRun.state === "Terminated") {
                _StdOut.putText(`Sorry, this program has been terminated`);
                return;
            }
            if (_CPU.isExecuting) {
                _StdOut.putText(`CPU is already running a program.`);
                return;
            }
            _Scheduler.prepareProgram(programToRun);
            // Set Scheduler to single-run mode.
            _Scheduler.isSingleRunMode = true;
            _Scheduler.singleRunProgramPID = programToRun.PID;
            _Scheduler.currentProgramIndex = _Programs.indexOf(programToRun);
            programToRun.state = "Running";
            _CPU.run();
            _StdOut.putText(`Running program with PID: ${pid}`);
        }
        shellClearMem = () => {
            _Memory.init();
            _MemoryManager.pidToSegmentMap = {};
            _CPU.init();
            _Scheduler.init();
            _Programs.forEach(program => program.init());
            _Programs = [];
            _MemoryAccessor.updateMemoryDisplay();
            _StdOut.putText("Memory has been cleared.");
            const pcbContainer = document.getElementById("pcb-container");
            if (pcbContainer) {
                pcbContainer.innerHTML = '';
            }
        };
        shellRunAll() {
            _CPU.isExecuting = true;
            _Scheduler.currentProgramIndex = 0;
            _Scheduler.cyclesExecuted = 0;
            _Scheduler.executeNonTerminatedPrograms();
        }
        shellKill(args) {
            if (args.length > 0) {
                const pid = parseInt(args[0]);
                if (isNaN(pid)) {
                    _StdOut.putText('Please provide a valid PID.');
                    return;
                }
                let programExists = false;
                const terminatedProgram = _Programs.find(program => program.segment === _CPU.segment);
                for (let i = 0; i < _Programs.length; i++) {
                    if (_Programs[i].PID === pid) {
                        programExists = true;
                        _Programs[i].state = "Terminated";
                        _CPU.updatePCBDisplay(terminatedProgram);
                        _StdOut.putText('Program with PID ${pid} has been terminated.');
                        break;
                    }
                }
                if (!programExists) {
                    _StdOut.putText('No program with PID ${pid} found.');
                }
            }
            else {
                _StdOut.putText("Usage: kill <PID>  Please supply a PID.");
            }
        }
        shellKillAll(args) {
            if (_Programs.length > 0) {
                for (let i = 0; i < _Programs.length; i++) {
                    if (_Programs[i].state !== "Terminated") {
                        _Programs[i].state = "Terminated";
                        _CPU.updatePCBDisplay(_Programs[i]);
                    }
                }
                _StdOut.putText("All loaded programs have been terminated.");
            }
            else {
                _StdOut.putText("No loaded programs found.");
            }
        }
        shellQuantum(args) {
            if (args.length === 0) {
                _StdOut.putText('Current quantum is set to ${_Scheduler.quantum}.');
            }
            else if (args.length === 1) {
                const newQuantum = parseInt(args[0]);
                if (!isNaN(newQuantum)) {
                    _Scheduler.quantum = newQuantum;
                    _StdOut.putText('Quantum updated to ${newQuantum}.');
                }
                else {
                    _StdOut.putText("Invalid quantum value. Please provide a valid integer.");
                }
            }
            else {
                _StdOut.putText("Usage: quantum 'int' - Display or set the quantum value.");
            }
        }
        shellPS(args) {
            if (_Programs.length === 0) {
                _StdOut.putText("No loaded programs.");
                return;
            }
            _StdOut.advanceLine();
            _Programs.forEach(program => {
                _StdOut.putText(`PID: ${program.PID}\tState: ${program.state}`);
                _StdOut.advanceLine();
            });
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map