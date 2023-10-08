module TSOS {
    export class Program {
        public PID: number;
        public startAddress: number;
        public endAddress: number;

        constructor(pid: number, start: number, end: number) {
            this.PID = pid;
            this.startAddress = start;
            this.endAddress = end;
        }
    }
}
