module TSOS {
    export class Program {
        public PID: number;
        public startAddress: number;
        public endAddress: number;
        public segment: number;
        
        public state: string;
        public PC: number;
        public ACC: number;
        public Xreg: number;
        public Yreg: number;
        public Zflag: number;

        constructor(pid: number, start: number, end: number, segment: number) {  
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
}
