var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        memory;
        constructor(memory) {
            this.memory = memory;
        }
        read(address) {
            if (address >= 0 && address < this.memory.memoryArray.length) {
                return this.memory.memoryArray[address];
            }
            else {
                _Kernel.krnTrace(`Invalid memory read address: ${address}`);
                return "00";
            }
        }
        write(address, value) {
            if (address >= 0 && address < this.memory.memoryArray.length) {
                this.memory.memoryArray[address] = value;
            }
            else {
                _Kernel.krnTrace(`Invalid memory write address: ${address}`);
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryAccessor.js.map