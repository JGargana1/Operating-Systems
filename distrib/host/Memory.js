var TSOS;
(function (TSOS) {
    class Memory {
        size;
        memoryArray;
        isOccupied = false;
        constructor(size = 256) {
            this.size = size;
            this.memoryArray = new Array(size).fill("00");
        }
        init() {
            for (let i = 0; i < this.size; i++) {
                this.memoryArray[i] = "00";
            }
            this.isOccupied = false;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Memory.js.map