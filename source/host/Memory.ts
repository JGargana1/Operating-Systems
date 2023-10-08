module TSOS {
    export class Memory {
        public memoryArray: string[];
        public isOccupied: boolean = false;

        constructor(private size: number = 256) { 
            this.memoryArray = new Array(size).fill("00");
        }

        public init(): void {
            for(let i = 0; i < this.size; i++) {
                this.memoryArray[i] = "00";
            }
            this.isOccupied = false;
        }
    }
}
