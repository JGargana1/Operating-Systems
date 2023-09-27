module TSOS {
    export class Memory {
        public memoryArray: string[];

        constructor(private size: number = 256) { // 256 bytes default size
            this.memoryArray = new Array(size).fill("00");
        }

        public init(): void {
            for(let i = 0; i < this.size; i++) {
                this.memoryArray[i] = "00"; // initialize each byte to 00
            }
        }
    }
}
