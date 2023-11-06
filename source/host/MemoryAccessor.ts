module TSOS {
    export class MemoryAccessor {
        constructor(public memory: Memory) {}

        public read(segment: number, address: number): string {
            if (address < 0 || address >= this.memory.segmentSize) {
                _Kernel.krnTrace(`Memory read violation at segment ${segment}, address ${address}`);
            }
            if (!this.checkAddressWithinSegmentBounds(segment, address)) {
                _Kernel.krnTrace(`Memory read out of segment bounds at segment ${segment}, address ${address}`);
            }

            _Kernel.krnTrace(`Reading memory at segment ${segment} and address ${address}`);
            return this.memory.memorySegments[segment][address];
        }

        public write(segment: number, address: number, value: string): void {
            if (address < 0 || address >= this.memory.segmentSize) {
                _Kernel.krnTrace(`Memory write violation at segment ${segment}, address ${address}`);
                _StdOut.putText(`Memory bounds error`);

                
            }
            if (!this.checkAddressWithinSegmentBounds(segment, address)) {
                _Kernel.krnTrace(`Memory write out of segment bounds at segment ${segment}, address ${address}`);
                _StdOut.putText(`Memory bounds error`);

            }

            _Kernel.krnTrace(`Writing to memory at segment ${segment} and address ${address} with value ${value}`);``
            this.memory.memorySegments[segment][address] = value;
            this.updateMemoryDisplay();
        }

        private checkAddressWithinSegmentBounds(segment: number, address: number): boolean {
            let base = _MemoryManager.segmentBases[segment];
            let limit = _MemoryManager.segmentLimits[segment];
            return (address >= 0 && address < this.memory.segmentSize);
        }

        public getMemorySize(): number {
            return this.memory.memorySegments.length * this.memory.segmentSize; 
        }

        public updateMemoryDisplay(): void {
            for (let segment = 0; segment < this.memory.segments; segment++) {
                const segmentContent = document.getElementById(`segment-${segment}`);
                if (segmentContent) {
                    segmentContent.innerHTML = '';

                    for (let i = 0; i < this.memory.segmentSize; i++) {
                        const byteValue = this.memory.memorySegments[segment][i];
                        const byteSpan = document.createElement('span');
                        byteSpan.textContent = byteValue;
                        segmentContent.appendChild(byteSpan);
                    }
                }
            }
        }
        
        
        
        

       
    }
}
