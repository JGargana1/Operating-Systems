var TSOS;
(function (TSOS) {
    class PCB {
        PID; // Process ID
        PC; // Program Counter
        Acc; // Accumulator
        Xreg; // X register
        Yreg; // Y register
        Zflag; // Z flag
        state; // "running", "waiting", etc.
        constructor(PID, PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, state = "new") {
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.state = state;
        }
        updateState(state) {
            this.state = state;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=PCB.js.map