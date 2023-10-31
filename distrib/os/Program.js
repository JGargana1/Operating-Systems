var TSOS;
(function (TSOS) {
    class Program {
        PID;
        startAddress;
        endAddress;
        segment;
        state;
        PC;
        ACC;
        Xreg;
        Yreg;
        Zflag;
        constructor(pid, start, end, segment) {
            this.PID = pid;
            this.startAddress = start;
            this.endAddress = end;
            this.segment = segment;
            this.state = "Resident";
            this.PC = 0;
            this.ACC = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
        }
    }
    TSOS.Program = Program;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Program.js.map