module TSOS {
    export class MemoryAccessor {

        constructor(private memory: Memory) {}

        public read(address: number): string {
            if (address >= 0 && address < this.memory.memoryArray.length) {
                return this.memory.memoryArray[address];
            } else {
                
                _Kernel.krnTrace(`Invalid memory read address: ${address}`);
                return "00";
            }
        }

        public write(address: number, value: string): void {
            if (address >= 0 && address < this.memory.memoryArray.length) {
                this.memory.memoryArray[address] = value;
            } else {
                
                _Kernel.krnTrace(`Invalid memory write address: ${address}`);
            }
        }
    }
}
