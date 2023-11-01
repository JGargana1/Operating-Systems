module TSOS {
    export class Memory {
        public memorySegments: string[][];
        public byteOccupiedFlags: boolean[][];

        constructor(private segments: number = 3, public segmentSize: number = 256) {
            this.memorySegments = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill("00"));
            this.byteOccupiedFlags = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill(false));

            

        }

        public init(): void {
            for(let segment = 0; segment < this.segments; segment++) {
                for(let i = 0; i < this.segmentSize; i++) {
                    this.memorySegments[segment][i] = "00";
                    this.byteOccupiedFlags[segment][i] = false;
                }
            }
        }
    }
}
