module TSOS {
    export class Program {
        public PID: number;
        public startAddress: number;
        public endAddress: number;
        public segment: number;  

        constructor(pid: number, start: number, end: number, segment: number) {  
            this.PID = pid;
            this.startAddress = start;
            this.endAddress = end;
            this.segment = segment;  
        }
    }
}
