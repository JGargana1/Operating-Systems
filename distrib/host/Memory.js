var TSOS;
(function (TSOS) {
    class Memory {
        segments;
        segmentSize;
        memorySegments;
        byteOccupiedFlags;
        segmentBases;
        segmentLimits;
        pidToSegmentMap = {};
        constructor(segments = 3, segmentSize = 256) {
            this.segments = segments;
            this.segmentSize = segmentSize;
            this.memorySegments = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill("00"));
            this.byteOccupiedFlags = new Array(segments).fill([]).map(_ => new Array(segmentSize).fill(false));
            this.segmentBases = [0, 256, 512];
            this.segmentLimits = [255, 511, 767];
        }
        init() {
            for (let segment = 0; segment < this.segments; segment++) {
                for (let i = 0; i < this.segmentSize; i++) {
                    this.memorySegments[segment][i] = "00";
                    this.byteOccupiedFlags[segment][i] = false;
                }
            }
            this.pidToSegmentMap = {};
        }
        assignSegmentToPID(pid, segment) {
            this.pidToSegmentMap[pid] = segment;
        }
        getSegmentByPID(pid) {
            return this.pidToSegmentMap[pid];
        }
        isByteOccupied(segment, address) {
            return this.byteOccupiedFlags[segment][address];
        }
        setByteOccupied(segment, address, occupied) {
            this.byteOccupiedFlags[segment][address] = occupied;
        }
        findFreeSegmentStartAddress() {
            return 0;
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