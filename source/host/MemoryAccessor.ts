module TSOS {
    export class MemoryAccessor {
        constructor(public memory: Memory) {}

        public read(segment: number, address: number): string {
            if (address < 0 || address >= this.memory.segmentSize) {
                _Kernel.krnTrace(`Memory read violation at segment ${segment}, address ${address}`);
                throw new Error(`Memory read violation at segment ${segment}, address ${address}`);
            }
            if (!this.checkAddressWithinSegmentBounds(segment, address)) {
                _Kernel.krnTrace(`Memory read out of segment bounds at segment ${segment}, address ${address}`);
                throw new Error(`Memory read out of segment bounds at segment ${segment}, address ${address}`);
            }

            _Kernel.krnTrace(`Reading memory at segment ${segment} and address ${address}`);
            return this.memory.memorySegments[segment][address];
        }

        public write(segment: number, address: number, value: string): void {
            if (address < 0 || address >= this.memory.segmentSize) {
                _Kernel.krnTrace(`Memory write violation at segment ${segment}, address ${address}`);
                _StdOut.putText(`Memory write violation at segment ${segment}, address ${address}`);
        
                throw new Error(`Memory write violation at segment ${segment}, address ${address}`);
                
            }
            if (!this.checkAddressWithinSegmentBounds(segment, address)) {
                _Kernel.krnTrace(`Memory write out of segment bounds at segment ${segment}, address ${address}`);
                _StdOut.putText(`Memory write out of segment bounds at segment ${segment}, address ${address}`);
        
                throw new Error(`Memory write out of segment bounds at segment ${segment}, address ${address}`);
            }
        
            this.memory.memorySegments[segment][address] = value;
        
            this.memory.updateMemoryDisplay(segment, address, value);
        
            
        }
        

        private checkAddressWithinSegmentBounds(segment: number, address: number): boolean {
            let base = _MemoryManager.segmentBases[segment];
            let limit = _MemoryManager.segmentLimits[segment];
            return (address >= 0 && address < this.memory.segmentSize);
        }

        public getMemorySize(): number {
            return this.memory.memorySegments.length * this.memory.segmentSize; 
        }

       
        

       
    }
}
