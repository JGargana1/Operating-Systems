module TSOS {
    export class DiskBlock {
        public inUse: string;         
        public directoryKey: string;  
        public data: string;          

        constructor() {
            this.inUse = "0";                
            this.directoryKey = "0".repeat(3); 
            this.data = "0".repeat(60);       
        }
    }
}
