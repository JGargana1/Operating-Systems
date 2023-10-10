var TSOS;
(function (TSOS) {
    class Memory {
        size;
        memoryArray;
        byteOccupiedFlags;
        constructor(size = 256) {
            this.size = size;
            this.memoryArray = new Array(size).fill("00");
            // Initialize the byteOccupiedFlags
            this.byteOccupiedFlags = new Array(size).fill(false);
        }
        init() {
            for (let i = 0; i < this.size; i++) {
                this.memoryArray[i] = "00";
                this.byteOccupiedFlags[i] = false;
            }
        }
        isByteOccupied(address) {
            return this.byteOccupiedFlags[address];
        }
        setByteOccupied(address, occupied) {
            this.byteOccupiedFlags[address] = occupied;
        }
        findFreeSpace(requiredSize) {
            let freeCount = 0;
            for (let i = 0; i < this.size; i++) {
                if (!this.isByteOccupied(i)) {
                    freeCount++;
                    if (freeCount === requiredSize) {
                        return i - requiredSize + 1;
                    }
                }
                else {
                    freeCount = 0;
                }
            }
            return -1;
        }
        isMemoryOccupied() {
            return this.byteOccupiedFlags.some(flag => flag);
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Memory.js.map