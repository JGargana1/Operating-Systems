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
                console.log(`Attempt to write value ${value} to invalid memory address ${address.toString(16).toUpperCase().padStart(4, '0')}`);
                _Kernel.krnTrace(`Invalid memory write at segment ${segment} and address ${address}`);
                throw new Error(`Invalid memory write at segment ${segment} and address ${address}`);
            }
            _Kernel.krnTrace(`Writing to memory at segment ${segment} and address ${address} with value ${value}`);
            this.memory.memorySegments[segment][address] = value;
            this.memory.setByteOccupied(segment, address, true);
        }
        getMemorySize() {
            return this.memory.memorySegments.length * this.memory.segmentSize;
        }
        clearMemory() {
            this.memory.init();
        }
        updateMemoryDisplay(address, value) {
            let table = document.getElementById("memoryTable");
            let rowIndex = Math.floor(address / 8);
            let cellIndex = (address % 8) + 1;
            if (table && table.rows[rowIndex]) {
                let row = table.rows[rowIndex];
                if (row.cells[cellIndex]) {
                    row.cells[cellIndex].textContent = value.toUpperCase();
                }
            }
        }
        findFreeSegment() {
            return this.memory.findFreeSegment();
        }
        findFreeSegmentStartAddress() {
            return this.memory.findFreeSegmentStartAddress();
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryAccessor.js.map