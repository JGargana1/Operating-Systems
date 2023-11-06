module TSOS {
    export class Scheduler {
        public isSingleRunMode: boolean = false;
        public singleRunProgramPID: number | null = null; 

        public currentProgramIndex: number = 0;
        public cyclesExecuted: number = 0;
        public quantum: number = 6; 


        public init(): void {
            this.currentProgramIndex = 0;
            this.cyclesExecuted = 0;
            
        }
        
        public cycleRoundRobin(): void {
            if (this.isSingleRunMode) {
                // Only run the current program if we're in single-run mode
                const currentProgram = _Programs[this.currentProgramIndex];
                if (currentProgram && currentProgram.PID === this.singleRunProgramPID) {
                    if (currentProgram.state !== "Terminated") {
                        _CPU.cycle(); // Execute the CPU cycle for the current program
                        this.cyclesExecuted++;
                    } else {
                        this.isSingleRunMode = false;
                        this.singleRunProgramPID = null;
                        _CPU.isExecuting = false;
                    }
                }
            } else {
                if (_CPU.isExecuting) {
                    const currentProgram = _Programs[this.currentProgramIndex];
                    if (currentProgram && currentProgram.state !== "Terminated") {
                        _CPU.cycle();
                        this.cyclesExecuted++;
                    }
                    if (this.cyclesExecuted >= this.quantum) {
                        this.contextSwitch();
                    }
                } else {
                    this.executeNonTerminatedPrograms();
                }
            }
        }

        public executeNonTerminatedPrograms(): void {
            if (this.currentProgramIndex < _Programs.length) {
                const currentProgram = _Programs[this.currentProgramIndex];
                if (currentProgram.state !== "Terminated") {
                    this.prepareProgram(currentProgram);
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0;
                } else {
                    this.currentProgramIndex++;
                    this.executeNonTerminatedPrograms();
                }
            } else {
                _Kernel.krnTrace("All programs have terminated.");
                _CPU.isExecuting = false;
            }
        }
        
        
        

        private findNextProgram(): number {
            let startIndex = (this.currentProgramIndex + 1) % _Programs.length;
            for (let i = 0; i < _Programs.length; i++) {
                let index = (startIndex + i) % _Programs.length;
                if (_Programs[index].state !== "Terminated") {
                    return index;
                }
            }
            return -1; 
        }

        public prepareProgram(program): void {
            _CPU.PC = program.PC;
            _CPU.Acc = program.ACC;
            _CPU.Xreg = program.Xreg;
            _CPU.Yreg = program.Yreg;
            _CPU.Zflag = program.Zflag;
            _CPU.segment = program.segment;
        }

        private contextSwitch(): void {
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
            }
            
        }

        private saveCPUState(program): void {
            program.PC = _CPU.PC;
            program.Acc = _CPU.Acc;
            program.Xreg = _CPU.Xreg;
            program.Yreg = _CPU.Yreg;
            program.Zflag = _CPU.Zflag;

            
            program.state = "Ready"; 
        }

        public onProgramTermination(): void {
            _Programs[this.currentProgramIndex].state = "Terminated";
        
            if (this.isSingleRunMode) {
                this.isSingleRunMode = false;
                this.singleRunProgramPID = null;
                _CPU.isExecuting = false;
            } else {
                // Proceed with normal round-robin termination
                let nextProgramIndex = this.findNextProgram();
                
                if (nextProgramIndex !== -1) {
                    this.currentProgramIndex = nextProgramIndex;
                    this.prepareProgram(_Programs[nextProgramIndex]);
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0; 
                } else {
                    _Kernel.krnTrace("All programs have terminated.");
                    _CPU.isExecuting = false;
                }
            }
        }
        
        
        

        
    }
}
