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
            for(let segment = 0; segment < this.memory.segments; segment++) {
                if (!this.isSegmentOccupied(segment)) {
                    return segment;
                }
            }
            return -1; 
        }

        public isSegmentOccupied(segment: number): boolean {
            return this.memory.byteOccupiedFlags[segment].some(flag => flag);
        }

        public checkBounds(pid: number, address: number): boolean {
            let segment = this.getSegmentByPID(pid);
            if (segment === undefined) {
                _Kernel.krnTrace(`Segment not found for PID ${pid}`);
            }
            let base = this.segmentBases[segment];
            let limit = this.segmentLimits[segment];
            return (address >= base && address <= limit);
        }
 
        
    }
}
