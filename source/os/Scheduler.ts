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
            if (this.isSingleRunMode && this.singleRunProgramPID !== null) {
                // In single-run mode, we find the specific program and run it exclusively
                let program = _Programs.find(p => p.PID === this.singleRunProgramPID);
        
                if (program && program.state !== "Terminated") {
                    
                    program.state = "Running"; 
                    _CPU.updatePCBDisplay(program); 
                    _CPU.cycle(); 
                    
                } else {
                    this.exitSingleRunMode();
                }
            } else {
                // Normal round-robin execution
                if (_CPU.isExecuting) {
                    let currentProgram = _Programs[this.currentProgramIndex];
                    if (currentProgram && currentProgram.state !== "Terminated") {
                        currentProgram.state = "Running"; 
                        _CPU.updatePCBDisplay(currentProgram); 
                        _CPU.cycle(); 
                        this.cyclesExecuted++;
        
                        if (this.cyclesExecuted >= this.quantum) {
                            this.contextSwitch(); 
                        }
                    } else {
                        this.contextSwitch(); 
                    }
                } else {
                    this.contextSwitch(); 
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

            program.state = "Running";
        }

        private contextSwitch(): void {
            // Perform context switch only if we are not in single-run mode
            if (!this.isSingleRunMode) {
                if (_CPU.isExecuting) {
                    let currentProgram = _Programs[this.currentProgramIndex];
                    this.saveCPUState(currentProgram);
        
                    if (currentProgram.state !== "Terminated") {
                        currentProgram.state = "Ready";
                        _CPU.updatePCBDisplay(currentProgram); 
                    }
                }
        
                let nextProgramIndex = this.findNextProgram();
                if (nextProgramIndex !== -1) {
                    // If there is another program to execute, switch to it
                    this.currentProgramIndex = nextProgramIndex;
                    let nextProgram = _Programs[nextProgramIndex];
                    this.prepareProgram(nextProgram);
                    _CPU.isExecuting = true;
                    this.cyclesExecuted = 0;
                } else {
                    _CPU.isExecuting = false;
                    this.currentProgramIndex = -1;
                }
            }
        }
        

        private exitSingleRunMode(): void {
            this.isSingleRunMode = false;
            this.singleRunProgramPID = null;
            _CPU.isExecuting = false;
            this.currentProgramIndex = -1; 
        }
        
        
        

        private saveCPUState(program): void {
            if (_CPU.isExecuting) {
                program.PC = _CPU.PC;
                program.Acc = _CPU.Acc;
                program.Xreg = _CPU.Xreg;
                program.Yreg = _CPU.Yreg;
                program.Zflag = _CPU.Zflag;
            }
        }

        public onProgramTermination(): void {
            let currentProgram = _Programs[this.currentProgramIndex];
            currentProgram.state = "Terminated";
            _CPU.isExecuting = false; 
            
        
            if (this.isSingleRunMode) {
                this.isSingleRunMode = false;
                this.singleRunProgramPID = null;
                _StdOut.putText(`Program with PID: ${currentProgram.PID} has terminated.`);
                this.exitSingleRunMode();

            } else {
                // In round-robin mode, we should find the next program to run
                let nextProgramIndex = this.findNextProgram();
        
                if (nextProgramIndex !== -1) {
                    // If there's another program to run, prepare it and continue execution
                    this.currentProgramIndex = nextProgramIndex;
                    let nextProgram = _Programs[nextProgramIndex];
                    this.prepareProgram(nextProgram);
                    nextProgram.state = "Running"; 
                    _CPU.isExecuting = true; 
                    this.cyclesExecuted = 0; 
                } else {
                }
            }
        }
        
        
        
        

        
    }
}
