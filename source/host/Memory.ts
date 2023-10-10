module TSOS {
    export class Memory {
        public memoryArray: string[];
        public byteOccupiedFlags: boolean[];

        constructor(private size: number = 256) { 
            this.memoryArray = new Array(size).fill("00");
            // Initialize the byteOccupiedFlags
            this.byteOccupiedFlags = new Array(size).fill(false);
        }

        public init(): void {
            for(let i = 0; i < this.size; i++) {
                this.memoryArray[i] = "00";
                this.byteOccupiedFlags[i] = false;
            }
        }

        public isByteOccupied(address: number): boolean {
            return this.byteOccupiedFlags[address];
        }

        public setByteOccupied(address: number, occupied: boolean): void {
            this.byteOccupiedFlags[address] = occupied;
        }

        
        public findFreeSpace(requiredSize: number): number {
            let freeCount = 0;
            for (let i = 0; i < this.size; i++) {
                if (!this.isByteOccupied(i)) {
                    freeCount++;
                    if (freeCount === requiredSize) {
                        return i - requiredSize + 1;  
                    }
                } else {
                    freeCount = 0;  
                }
            }
            return -1;  
        }
        public isMemoryOccupied(): boolean {
            return this.byteOccupiedFlags.some(flag => flag); 
        }
    }
}
