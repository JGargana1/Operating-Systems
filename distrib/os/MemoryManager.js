var TSOS;
(function (TSOS) {
    class MemoryManager {
        memoryAccessor;
        constructor(memoryAccessor) {
            this.memoryAccessor = memoryAccessor;
        }
        loadProgramIntoMemory(program) {
            for (let i = 0; i < program.length; i++) {
                this.memoryAccessor.write(i, program[i]);
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryManager.js.map