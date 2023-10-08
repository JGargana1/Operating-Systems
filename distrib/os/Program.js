var TSOS;
(function (TSOS) {
    class Program {
        PID;
        startAddress;
        endAddress;
        constructor(pid, start, end) {
            this.PID = pid;
            this.startAddress = start;
            this.endAddress = end;
        }
    }
    TSOS.Program = Program;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Program.js.map