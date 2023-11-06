var TSOS;
(function (TSOS) {
    class MemoryManager {
        memory;
        pidToSegmentMap = {};
        segmentBases = [0, 256, 512];
        segmentLimits = [255, 511, 767];
        constructor(memory) {
            this.memory = memory;
        }
        assignSegmentToPID(pid, segment) {
            this.pidToSegmentMap[pid] = segment;
        }
        getSegmentByPID(pid) {
            return this.pidToSegmentMap[pid];
        }
        isByteOccupied(segment, address) {
            return this.memory.byteOccupiedFlags[segment][address];
        }
        setByteOccupied(segment, address, occupied) {
            this.memory.byteOccupiedFlags[segment][address] = occupied;
        }
        findFreeSegment() {
            for (let segment = 0; segment < this.memory.segments; segment++) {
                if (!this.isSegmentOccupied(segment)) {
                    return segment;
                }
            }
            return -1;
        }
        isSegmentOccupied(segment) {
            return this.memory.byteOccupiedFlags[segment].some(flag => flag);
        }
        checkBounds(pid, address) {
            let segment = this.getSegmentByPID(pid);
            if (segment === undefined) {
                _Kernel.krnTrace(`Segment not found for PID ${pid}`);
            }
            let base = this.segmentBases[segment];
            let limit = this.segmentLimits[segment];
            return (address >= base && address <= limit);
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryManager.js.map