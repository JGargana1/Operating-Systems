var TSOS;
(function (TSOS) {
    class Program {
        PID;
        startAddress;
        endAddress;
        segment;
        constructor(pid, start, end, segment) {
            this.PID = pid;
            this.startAddress = start;
            this.endAddress = end;
            this.segment = segment;
        }
    }
    TSOS.Program = Program;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Program.js.map