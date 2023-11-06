var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        memory;
        constructor(memory) {
            this.memory = memory;
        }
        read(segment, address) {
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
        write(segment, address, value) {
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
            _Kernel.krnTrace(`Writing to memory at segment ${segment} and address ${address} with value ${value}`);
            ``;
            this.memory.memorySegments[segment][address] = value;
            this.updateMemoryDisplay();
        }
        checkAddressWithinSegmentBounds(segment, address) {
            let base = _MemoryManager.segmentBases[segment];
            let limit = _MemoryManager.segmentLimits[segment];
            return (address >= 0 && address < this.memory.segmentSize);
        }
        getMemorySize() {
            return this.memory.memorySegments.length * this.memory.segmentSize;
        }
        updateMemoryDisplay() {
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
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryAccessor.js.map