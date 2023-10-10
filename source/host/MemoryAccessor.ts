module TSOS {
    export class MemoryAccessor {

        constructor(public memory: Memory) {}

        public read(address: number): string {
            if (address < 0 || address >= this.memory.memoryArray.length) {
                _Kernel.krnTrace(`Invalid memory read at address ${address}`);
                throw new Error(`Invalid memory read at address ${address}`);
            }

            _Kernel.krnTrace(`Reading memory at address ${address}`);

            return this.memory.memoryArray[address];
        }
        
        public write(address: number, value: string): void {
            
            
            if (address < 0 || address >= this.memory.memoryArray.length) {

                console.log(`Attempt to write value ${value} to invalid memory address ${address.toString(16).toUpperCase().padStart(4, '0')}`);
                _Kernel.krnTrace(`Invalid memory write at address ${address}`);
                throw new Error(`Invalid memory write at address ${address}`);
            }
            console.log(`Writing value ${value} to memory address ${address.toString(16).toUpperCase().padStart(4, '0')}`);
            
            
        
            _Kernel.krnTrace(`Writing to memory at address ${address} with value ${value}`);
            this.updateMemoryDisplay(address, value);  
            this.memory.memoryArray[address] = value;
            this.memory.setByteOccupied(address, true);
        }
        
        

        public getMemorySize(): number {
            return this.memory.memoryArray.length;
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
        public findFreeSpace(requiredSize: number): number {
            return this.memory.findFreeSpace(requiredSize);
        }
        
    }
}
