var TSOS;
(function (TSOS) {
    class DiskBlock {
        inUse;
        directoryKey;
        data;
        constructor() {
            this.inUse = "0";
            this.directoryKey = "0".repeat(3);
            this.data = "0".repeat(60);
        }
    }
    TSOS.DiskBlock = DiskBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=DiskBlock.js.map