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
                _Kernel.krnTrace(`Invalid memory write at segment ${segment} and address ${address}`);
                throw new Error(`Invalid memory write at segment ${segment} and address ${address}`);
            }
        
            _Kernel.krnTrace(`Writing to memory at segment ${segment} and address ${address} with value ${value}`);
            this.memory.memorySegments[segment][address] = value;

            this.updateMemoryDisplay();

            


        }

        public getMemorySize(): number {
            return this.memory.memorySegments.length * this.memory.segmentSize; 
        }

        private updateMemoryDisplay(): void {
            const memoryDisplay = document.getElementById('memoryDisplay');
            if (!memoryDisplay) return;
        
            memoryDisplay.innerHTML = '';
            
            for(let segment = 0; segment < this.memory.memorySegments.length; segment++) {
                const segmentDiv = document.createElement("div");
                segmentDiv.classList.add("memorySegment");
                segmentDiv.innerHTML = `<h4>Segment ${segment}</h4>`;
                
                for(let i = 0; i < this.memory.segmentSize; i++) {
                    const byteDiv = document.createElement("div");
                    byteDiv.classList.add("memoryByte");
                    byteDiv.innerText = this.memory.memorySegments[segment][i];
                    segmentDiv.appendChild(byteDiv);
                }
                
                memoryDisplay.appendChild(segmentDiv);
            }
        }

       
    }
}
