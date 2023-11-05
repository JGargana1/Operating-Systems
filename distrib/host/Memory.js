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
        generateMemoryDisplay() {
            for (let segment = 0; segment < 3; segment++) {
                const segmentContent = document.getElementById(`segment-${segment}`);
                for (let byte = 0; byte < 256; byte++) {
                    const span = document.createElement('span');
                    span.id = `byte-${segment}-${byte}`;
                    span.textContent = '00';
                    segmentContent.appendChild(span);
                }
            }
        }
        static resetMemoryDisplay() {
            for (let segment = 0; segment < 3; segment++) {
                for (let byte = 0; byte < 256; byte++) {
                    const spanId = `byte-${segment}-${byte}`;
                    const spanElement = document.getElementById(spanId);
                    if (spanElement) {
                        spanElement.textContent = '00';
                    }
                }
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=Memory.js.map