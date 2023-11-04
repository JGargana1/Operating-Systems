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
            if (this.isSingleRunMode) {
                // Only run the current program if we're in single-run mode
                let currentProgram = _Programs[this.currentProgramIndex];
                if (currentProgram && currentProgram.PID === this.singleRunProgramPID) {
                    if (currentProgram.state !== "Terminated") {
                        _CPU.cycle(); // Execute the CPU cycle for the current program
                        this.cyclesExecuted++;
                    }
                    else {
                        // The program has terminated, end single-run mode and halt execution
                        this.isSingleRunMode = false;
                        this.singleRunProgramPID = null; // Clear the single run PID
                        _CPU.isExecuting = false;
                    }
                }
            }
            else {
                // Normal round-robin execution if not in single-run mode
                if (_CPU.isExecuting) {
                    _CPU.cycle();
                    this.cyclesExecuted++;
                    if (this.cyclesExecuted >= this.quantum) {
                        this.contextSwitch();
                    }
                }
                else {
                    let nextProgramIndex = this.findNextProgram();
                    if (nextProgramIndex !== -1) {
                        this.currentProgramIndex = nextProgramIndex;
                        this.prepareProgram(_Programs[nextProgramIndex]);
                        _CPU.isExecuting = true;
                        this.cyclesExecuted = 0;
                    }
                }
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
        }
        contextSwitch() {
            if (!this.isSingleRunMode) {
                // Save CPU state for the current program
                this.saveCPUState(_Programs[this.currentProgramIndex]);
                // Find the index of the next program to run
                let nextProgramIndex = this.findNextProgram();
                if (nextProgramIndex !== -1) {
                    this.prepareProgram(_Programs[nextProgramIndex]);
                    this.currentProgramIndex = nextProgramIndex;
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0;
                }
                // The context switch logic in single-run mode is omitted because we do not switch
            }
            // If single-run mode is active, we don't need to save the state or switch to another process
            // So there is no else block needed here for single-run mode.
        }
        saveCPUState(program) {
            program.PC = _CPU.PC;
            program.Acc = _CPU.Acc;
            program.Xreg = _CPU.Xreg;
            program.Yreg = _CPU.Yreg;
            program.Zflag = _CPU.Zflag;
            program.state = "Ready";
        }
        onProgramTermination() {
            _Programs[this.currentProgramIndex].state = "Terminated";
            if (this.isSingleRunMode) {
                // In single-run mode, we should not look for the next program
                this.isSingleRunMode = false;
                this.singleRunProgramPID = null;
                _CPU.isExecuting = false;
                _StdOut.putText(`Program with PID: ${_Programs[this.currentProgramIndex].PID} has terminated.`);
            }
            else {
                // Proceed with normal round-robin termination
                let nextProgramIndex = this.findNextProgram();
                if (nextProgramIndex !== -1) {
                    this.currentProgramIndex = nextProgramIndex;
                    this.prepareProgram(_Programs[nextProgramIndex]);
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0;
                }
                else {
                    _Kernel.krnTrace("All programs have terminated.");
                    _CPU.isExecuting = false;
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Scheduler.js.map