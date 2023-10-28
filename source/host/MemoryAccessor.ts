module TSOS {
    export class MemoryAccessor {

        constructor(public memory: Memory) {}

        public read(segment: number, address: number): string {
            if (address < 0 || address >= this.memory.segmentSize) {
                _Kernel.krnTrace(`Invalid memory read at segment ${segment} and address ${address}`);
                throw new Error(`Invalid memory read at segment ${segment} and address ${address}`);
            }

            _Kernel.krnTrace(`Reading memory at segment ${segment} and address ${address}`);

            return this.memory.memorySegments[segment][address];
        }

        public write(segment: number, address: number, value: string): void {
            
        
            if (address < 0 || address >= this.memory.segmentSize) {
                console.log(`Writing value ${value} to memory segment ${segment} and address ${address.toString(16).toUpperCase().padStart(4, '0')}`);
                console.log(`Attempt to write value ${value} to invalid memory address ${address.toString(16).toUpperCase().padStart(4, '0')}`);
                _Kernel.krnTrace(`Invalid memory write at segment ${segment} and address ${address}`);
                throw new Error(`Invalid memory write at segment ${segment} and address ${address}`);
            }
        
            _Kernel.krnTrace(`Writing to memory at segment ${segment} and address ${address} with value ${value}`);
            this.memory.memorySegments[segment][address] = value;
            this.memory.setByteOccupied(segment, address, true);
        }
        
        public getMemorySize(): number {
            return this.memory.memorySegments.length * this.memory.segmentSize; 
        }

        public clearMemory(): void {
            this.memory.init();
        }

        private updateMemoryDisplay(address: number, value: string): void {
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("memoryTable");
            let rowIndex = Math.floor(address / 8);
            let cellIndex = (address % 8) + 1;  
        
            if (table && table.rows[rowIndex]) {
                let row = table.rows[rowIndex];
                if (row.cells[cellIndex]) {
                    row.cells[cellIndex].textContent = value.toUpperCase(); 
                }
            }
        }

        public findFreeSegment(): number {
            return this.memory.findFreeSegment();
        }

        public findFreeSegmentStartAddress(): number {
            return this.memory.findFreeSegmentStartAddress();
        }
    }
}
