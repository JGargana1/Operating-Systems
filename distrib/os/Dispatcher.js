var TSOS;
(function (TSOS) {
    class Dispatcher {
        prepareProgram(program) {
            _CPU.PC = program.PC;
            _CPU.Acc = program.ACC;
            _CPU.Xreg = program.Xreg;
            _CPU.Yreg = program.Yreg;
            _CPU.Zflag = program.Zflag;
            _CPU.segment = program.segment;
            program.state = "Running";
            _CPU.updatePCBDisplay(program);
        }
        cycleRoundRobin() {
            let currentProgram = _Programs[_Scheduler.currentProgramIndex];
            if (currentProgram && currentProgram.state !== "Terminated") {
                _CPU.cycle();
                _Scheduler.cyclesExecuted++;
                if (_Scheduler.cyclesExecuted >= _Scheduler.quantum || currentProgram.state === "Terminated") {
                    this.contextSwitch();
                }
            }
            else {
                this.contextSwitch();
            }
        }
        contextSwitch() {
            if (_CPU.isExecuting) {
                let currentProgram = _Programs[_Scheduler.currentProgramIndex];
                if (currentProgram && currentProgram.state !== "Terminated") {
                    this.saveCPUState(currentProgram);
                    currentProgram.state = "Ready";
                }
            }
            let nextProgramIndex = _Scheduler.findNextProgram();
            if (nextProgramIndex !== -1) {
                _Scheduler.currentProgramIndex = nextProgramIndex;
                this.prepareProgram(_Programs[nextProgramIndex]);
                _CPU.isExecuting = true;
            }
            else {
                _CPU.isExecuting = false;
                _Scheduler.currentProgramIndex = -1;
            }
            _Scheduler.cyclesExecuted = 0;
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
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Dispatcher.js.map