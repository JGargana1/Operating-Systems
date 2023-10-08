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
            if (this.memory.isOccupied) {
                _Kernel.krnTrace("Sorry, this memory segment is full.");
                return;
            }
            if (address >= 0 && address < this.memory.memoryArray.length) {
                this.memory.memoryArray[address] = value;
                this.updateMemoryDisplay(address, value);
            }
            else {
                _Kernel.krnTrace(`Invalid memory write address: ${address}`);
            }
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
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryAccessor.js.map