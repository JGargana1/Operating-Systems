module TSOS {
    export class Memory {
        public memorySegments: string[][];
        public byteOccupiedFlags: boolean[][];
        public segmentBases: number[];  
        public segmentLimits: number[]; 
        private pidToSegmentMap: { [pid: number]: number } = {}; 

        constructor(private segments: number = 3, public segmentSize: number = 256) {
            this.memorySegments = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill("00"));
            this.byteOccupiedFlags = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill(false));
            
            
            this.segmentBases = [0, 256, 512];
            this.segmentLimits = [255, 511, 767];
        }

        public init(): void {
            for(let segment = 0; segment < this.segments; segment++) {
                for(let i = 0; i < this.segmentSize; i++) {
                    this.memorySegments[segment][i] = "00";
                    this.byteOccupiedFlags[segment][i] = false;
                }
            }
            this.pidToSegmentMap = {}; 
        }

        public assignSegmentToPID(pid: number, segment: number): void {
            this.pidToSegmentMap[pid] = segment;
        }

        public getSegmentByPID(pid: number): number | undefined {
            return this.pidToSegmentMap[pid];
        }

        public isByteOccupied(segment: number, address: number): boolean {
            return this.byteOccupiedFlags[segment][address];
        }

        public setByteOccupied(segment: number, address: number, occupied: boolean): void {
            this.byteOccupiedFlags[segment][address] = occupied;
        }

        public findFreeSegmentStartAddress(): number {
            return 0;  
        }

        public isMemoryOccupied(): boolean {
            return this.byteOccupiedFlags.flat().some(flag => flag); 
        }

        public findFreeSegment(): number {
            for(let segment = 0; segment < this.segments; segment++) {
                if (!this.isSegmentOccupied(segment)) {
                    return segment;
                }
            }
            return -1;
        }

        public isSegmentOccupied(segment: number): boolean {
            return this.byteOccupiedFlags[segment].some(flag => flag);
        }
    }
}
