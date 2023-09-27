module TSOS {
    export class MemoryManager {
        
        constructor(private memoryAccessor: MemoryAccessor) {}

        public loadProgramIntoMemory(program: string[]): void {
            for (let i = 0; i < program.length; i++) {
                this.memoryAccessor.write(i, program[i]);
            }
        }

    }
}
