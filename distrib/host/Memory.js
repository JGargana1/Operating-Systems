var TSOS;
(function (TSOS) {
    class Memory {
        segments;
        segmentSize;
        memorySegments;
        byteOccupiedFlags;
        constructor(segments = 3, segmentSize = 256) {
            this.segments = segments;
            this.segmentSize = segmentSize;
            this.memorySegments = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill("00"));
            this.byteOccupiedFlags = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill(false));
        }
        init() {
            for (let segment = 0; segment < this.segments; segment++) {
                for (let i = 0; i < this.segmentSize; i++) {
                    this.memorySegments[segment][i] = "00";
                    this.byteOccupiedFlags[segment][i] = false;
                }
            }
        }
        isByteOccupied(segment, address) {
            return this.byteOccupiedFlags[segment][address];
        }
        setByteOccupied(segment, address, occupied) {
            this.byteOccupiedFlags[segment][address] = occupied;
        }
        findFreeSegmentStartAddress() {
            for (let segment = 0; segment < this.segments; segment++) {
                if (!this.byteOccupiedFlags[segment].some(flag => flag)) {
                    return 0;
                }
            }
            return -1;
        }
        isMemoryOccupied() {
            return this.byteOccupiedFlags.flat().some(flag => flag);
        }
        findFreeSegment() {
            for (let segment = 0; segment < this.segments; segment++) {
                if (!this.isSegmentOccupied(segment)) {
                    return segment;
                }
            }
            return -1;
        }
        isSegmentOccupied(segment) {
            return this.byteOccupiedFlags[segment].some(flag => flag);
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Memory.js.map