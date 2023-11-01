module TSOS {
    export class MemoryManager {
        public pidToSegmentMap: { [pid: number]: number } = {}; 
        public segmentBases: number[] = [0, 256, 512];
        public segmentLimits: number[] = [255, 511, 767];
        
        constructor(public memory: Memory) {}

        public assignSegmentToPID(pid: number, segment: number): void {
            this.pidToSegmentMap[pid] = segment;
        }

        public getSegmentByPID(pid: number): number | undefined {
            return this.pidToSegmentMap[pid];
        }

        public isByteOccupied(segment: number, address: number): boolean {
            return this.memory.byteOccupiedFlags[segment][address];
        }

        public setByteOccupied(segment: number, address: number, occupied: boolean): void {
            this.memory.byteOccupiedFlags[segment][address] = occupied;
        }

        public findFreeSegment(): number {
            for(let segment = 0; segment < this.memory.memorySegments.length; segment++) {
                if (!this.isSegmentOccupied(segment)) {
                    return segment;
                }
            }
            return -1;
        }

        public isSegmentOccupied(segment: number): boolean {
            return this.memory.byteOccupiedFlags[segment].some(flag => flag);
        }

        

        
        
        
        
    }
}
