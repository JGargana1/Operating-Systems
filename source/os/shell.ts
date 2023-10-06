/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {



        

        // Properties

    

        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {

            this.initDateTimeUpdater();
            
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellTrap,
                                  "trap", "-Trigger a test kernel error");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                                  "load", "- Validates the user code in the HTML5 text area.");
            this.commandList[this.commandList.length] = sc;




        


            

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            
            // date
            sc = new ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereAmI, "whereami", "- Displays where the user is currently located. (I know where you live)");
            this.commandList[this.commandList.length] = sc;

            // Lotto
            sc = new ShellCommand(this.shellLotto, "lotto", "- Have the chance to win a million bucks.");
            this.commandList[this.commandList.length] = sc;


            
            sc = new ShellCommand(this.shellStatus, "status", "<string> - Set the status message.");
            this.commandList[this.commandList.length] = sc;




            // Display the initial prompt.
            this.putPrompt();
        }

        public getCommandNames(): string[] {
            return this.commandList.map(command => command.command);
        }
        

        private initDateTimeUpdater() {
            const dateTimeDiv = document.getElementById('date-time');
            setInterval(() => {
                const now = new Date();
                dateTimeDiv.innerText = now.toLocaleString();
            }, 1000);
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }
    

        public shellMan(args: string[]) {
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
    } else {
        _StdOut.putText("Usage: man <topic>. Please supply a topic.");
    }
}


        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args: string[]) {
            const currentDate = new Date();
            _StdOut.putText(currentDate.toLocaleString());
        }
        
        public shellWhereAmI(args: string[]) {
            const locations = ["Mars", "The Matrix", "Marist", "In-between portals"];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            _StdOut.putText("Where you are curently standing: " + randomLocation);
        }
        
        public shellLotto(args: string[]) {
            const lottos = [
                "You lose!",
                "You just won a million bucks! press alt + f4 to win!",
                "You lose!",
                "You lose! (you really suck at this)",
            ];
            const randomLotto = lottos[Math.floor(Math.random() * lottos.length)];
            _StdOut.putText(randomLotto);
        }

        public shellStatus(args: string[]) {
            if (args.length > 0) {
                const statusMessage = args.join(' ');
                document.getElementById('status-display').innerText = 'Status: ' + statusMessage;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a status message.");
            }
        }

        public shellTrap(args): void {
            _Kernel.krnTrapError("Test trap command executed");
        }
        
        public shellLoad(args: string[]): void {
            const input: string = (document.getElementById('taProgramInput') as HTMLInputElement).value;
            
            // Validate that the input is not empty and contains only valid hexadecimal characters.
            const isValid: boolean = /^[0-9A-Fa-f\s]+$/.test(input);
            
            if (isValid) {
                const opCodes: string[] = input.split(/\s+/); // Split the input by whitespace to get individual op codes.
        
                if (opCodes.length <= 256) { // Checking if the input does not exceed memory capacity.
                    // Load the op codes into memory starting from location $0000.
                    for (let i = 0; i < opCodes.length; i++) {
                        // Use MemoryAccessor to write op codes to memory.
                        _MemoryAccessor.write(i, opCodes[i]);
                        console.log(`Address: ${i}, Value: ${_MemoryAccessor.read(i)}`);
                    }
        
                    // Increment the PID for the next process.
                    _PID++;
        
                    _StdOut.putText(`The input is valid and loaded into memory with PID: ${_PID}.`);
        
                } else {
                    _StdOut.putText("The input exceeds the memory capacity.");
                }
                
            } else {
                if (input === "") {
                    _StdOut.putText("The input is empty.");
                } else {
                    _StdOut.putText("The input is invalid. Only hex digits and spaces are allowed.");
                }
            }

            

        }
        public updateMemoryDisplay(): void {
            const memoryTable = document.getElementById('memoryTable') as HTMLTableElement;
            if (memoryTable) {
                for (let i = 0; i < _Memory.memoryArray.length; i++) {
                    // Calculate the row and column for the memory value.
                    const row = Math.floor(i / 8); // Each row has 8 values.
                    const col = (i % 8) + 1; // +1 to account for the address column (like "0x000").
        
                    // Get the row element.
                    const tableRow = memoryTable.rows[row];
                    if (tableRow) {
                        // Get the cell element and update its content.
                        const tableCell = tableRow.cells[col];
                        if (tableCell) {
                            tableCell.textContent = _Memory.memoryArray[i];
                        }
                    }
                }
            }
        }
        
        
        

       
        
    
        
        


    }
}
