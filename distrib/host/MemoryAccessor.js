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
            this.memory.memorySegments[segment][address] = value;
            this.memory.updateMemoryDisplay(segment, address, value);
        }
        checkAddressWithinSegmentBounds(segment, address) {
            let base = _MemoryManager.segmentBases[segment];
            let limit = _MemoryManager.segmentLimits[segment];
            return (address >= 0 && address < this.memory.segmentSize);
        }
        getMemorySize() {
            return this.memory.memorySegments.length * this.memory.segmentSize;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryAccessor.js.map