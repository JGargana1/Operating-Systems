var TSOS;
(function (TSOS) {
    class MemoryDisplay {
        static updateDisplay() {
            const memorySegmentsContainer = document.getElementById("memorySegmentsContainer");
            if (!memorySegmentsContainer)
                return;
            memorySegmentsContainer.innerHTML = ''; // Clear the container
            for (let segment = 0; segment < _Memory.memorySegments.length; segment++) {
                const segmentDiv = document.createElement("div");
                segmentDiv.classList.add("memorySegment");
                segmentDiv.innerHTML = `<h3>Segment ${segment}</h3>`;
                for (let i = 0; i < _Memory.segmentSize; i++) {
                    const byteDiv = document.createElement("div");
                    byteDiv.classList.add("memoryByte");
                    byteDiv.innerText = _Memory.memorySegments[segment][i];
                    segmentDiv.appendChild(byteDiv);
                }
                memorySegmentsContainer.appendChild(segmentDiv);
            }
        }
    }
    TSOS.MemoryDisplay = MemoryDisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryDisplay.js.map