var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        memory;
        constructor(memory) {
            this.memory = memory;
        }
        read(segment, address) {
            if (address < 0 || address >= this.memory.segmentSize) {
                _Kernel.krnTrace(`Invalid memory read at segment ${segment} and address ${address}`);
                throw new Error(`Invalid memory read at segment ${segment} and address ${address}`);
            }
            _Kernel.krnTrace(`Reading memory at segment ${segment} and address ${address}`);
            return this.memory.memorySegments[segment][address];
        }
        write(segment, address, value) {
            if (address < 0 || address >= this.memory.segmentSize) {
                console.log(`Writing value ${value} to memory segment ${segment} and address ${address.toString(16).toUpperCase().padStart(4, '0')}`);
                _Kernel.krnTrace(`Invalid memory write at segment ${segment} and address ${address}`);
                throw new Error(`Invalid memory write at segment ${segment} and address ${address}`);
            }
            _Kernel.krnTrace(`Writing to memory at segment ${segment} and address ${address} with value ${value}`);
            this.memory.memorySegments[segment][address] = value;
        }
        getMemorySize() {
            return this.memory.memorySegments.length * this.memory.segmentSize;
        }
        clearMemory() {
            this.memory.init();
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryAccessor.js.map