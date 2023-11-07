var TSOS;
(function (TSOS) {
    class Scheduler {
        isSingleRunMode = false;
        singleRunProgramPID = null;
        currentProgramIndex = 0;
        cyclesExecuted = 0;
        quantum = 6;
        init() {
            this.currentProgramIndex = 0;
            this.cyclesExecuted = 0;
        }
        cycleRoundRobin() {
            // Check if we are in single-run mode and that the specific program's PID is set
            if (this.isSingleRunMode && this.singleRunProgramPID !== null) {
                // In single-run mode, we find the specific program and run it exclusively
                let program = _Programs.find(p => p.PID === this.singleRunProgramPID);
                if (program && program.state !== "Terminated") {
                    // If the program is found and it is not terminated, execute it
                    program.state = "Running"; // Update the state to "Running"
                    _CPU.updatePCBDisplay(program); // Update the display to reflect the state
                    _CPU.cycle(); // Perform a CPU cycle
                    // No need for a quantum check in single-run mode
                }
                else {
                    // If the program is terminated or not found, we exit single-run mode
                    this.exitSingleRunMode();
                }
            }
            else {
                // Normal round-robin execution
                if (_CPU.isExecuting) {
                    let currentProgram = _Programs[this.currentProgramIndex];
                    if (currentProgram && currentProgram.state !== "Terminated") {
                        currentProgram.state = "Running"; // Set the program state to "Running"
                        _CPU.updatePCBDisplay(currentProgram); // Update the display to reflect the state
                        _CPU.cycle(); // Perform a CPU cycle
                        this.cyclesExecuted++;
                        if (this.cyclesExecuted >= this.quantum) {
                            this.contextSwitch(); // Perform a context switch if the quantum is reached
                        }
                    }
                    else {
                        this.contextSwitch(); // If the program is terminated, perform a context switch
                    }
                }
                else {
                    this.contextSwitch(); // If no program is currently executing, perform a context switch
                }
            }
        }
        executeNonTerminatedPrograms() {
            if (this.currentProgramIndex < _Programs.length) {
                const currentProgram = _Programs[this.currentProgramIndex];
                if (currentProgram.state !== "Terminated") {
                    this.prepareProgram(currentProgram);
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0;
                }
                else {
                    this.currentProgramIndex++;
                    this.executeNonTerminatedPrograms();
                }
            }
            else {
                _Kernel.krnTrace("All programs have terminated.");
                _CPU.isExecuting = false;
            }
        }
        findNextProgram() {
            let startIndex = (this.currentProgramIndex + 1) % _Programs.length;
            for (let i = 0; i < _Programs.length; i++) {
                let index = (startIndex + i) % _Programs.length;
                if (_Programs[index].state !== "Terminated") {
                    return index;
                }
            }
            return -1;
        }
        prepareProgram(program) {
            _CPU.PC = program.PC;
            _CPU.Acc = program.ACC;
            _CPU.Xreg = program.Xreg;
            _CPU.Yreg = program.Yreg;
            _CPU.Zflag = program.Zflag;
            _CPU.segment = program.segment;
            program.state = "Running";
        }
        contextSwitch() {
            // Perform context switch only if we are not in single-run mode
            if (!this.isSingleRunMode) {
                // Save the CPU state of the current program, if it was running
                if (_CPU.isExecuting) {
                    let currentProgram = _Programs[this.currentProgramIndex];
                    this.saveCPUState(currentProgram);
                    // If the program is not terminated, change its state to "Ready"
                    if (currentProgram.state !== "Terminated") {
                        currentProgram.state = "Ready";
                        _CPU.updatePCBDisplay(currentProgram); // Make sure to update the display
                    }
                }
                // Find the next program that is not terminated
                let nextProgramIndex = this.findNextProgram();
                if (nextProgramIndex !== -1) {
                    // If there is another program to execute, switch to it
                    this.currentProgramIndex = nextProgramIndex;
                    let nextProgram = _Programs[nextProgramIndex];
                    // Do not set the next program's state to "Running" here; it will be set when the CPU cycle starts for this program
                    this.prepareProgram(nextProgram);
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0;
                }
                else {
                    // If no non-terminated programs are left, stop CPU execution and reset current index
                    _Kernel.krnTrace("No non-terminated programs to run.");
                    _CPU.isExecuting = false;
                    this.currentProgramIndex = -1;
                }
            }
        }
        exitSingleRunMode() {
            // Reset single-run mode settings
            this.isSingleRunMode = false;
            this.singleRunProgramPID = null;
            _CPU.isExecuting = false;
            this.currentProgramIndex = -1; // Reset the index as no program is running
        }
        saveCPUState(program) {
            if (_CPU.isExecuting) {
                program.PC = _CPU.PC;
                program.Acc = _CPU.Acc;
                program.Xreg = _CPU.Xreg;
                program.Yreg = _CPU.Yreg;
                program.Zflag = _CPU.Zflag;
            }
        }
        onProgramTermination() {
            let currentProgram = _Programs[this.currentProgramIndex];
            currentProgram.state = "Terminated";
            _CPU.isExecuting = false; // Stop CPU execution for the current program
            // If we are in single-run mode, reset related flags and output termination message
            if (this.isSingleRunMode) {
                this.isSingleRunMode = false;
                this.singleRunProgramPID = null;
                _StdOut.putText(`Program with PID: ${currentProgram.PID} has terminated.`);
                this.exitSingleRunMode();
            }
            else {
                // In round-robin mode, we should find the next program to run
                let nextProgramIndex = this.findNextProgram();
                if (nextProgramIndex !== -1) {
                    // If there's another program to run, prepare it and continue execution
                    this.currentProgramIndex = nextProgramIndex;
                    let nextProgram = _Programs[nextProgramIndex];
                    this.prepareProgram(nextProgram);
                    nextProgram.state = "Running"; // Set the state of the new program to "Running"
                    _CPU.isExecuting = true; // Start CPU execution for the new program
                    this.cyclesExecuted = 0; // Reset the cycle counter for the quantum
                }
                else {
                    // If there are no more programs to run, output a trace message
                    _Kernel.krnTrace("All programs have terminated.");
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Scheduler.js.map