var TSOS;
(function (TSOS) {
    class MemoryDisplay {
        memory;
        constructor(memory) {
            this.memory = memory;
        }
        // Method to update the HTML spans with the current memory values
        updateDisplay() {
            for (let segment = 0; segment < this.memory.segments; segment++) {
                const segmentValues = this.memory.getSegment(segment);
                for (let byte = 0; byte < segmentValues.length; byte++) {
                    const spanId = `byte-${segment}-${byte}`;
                    const spanElement = document.getElementById(spanId);
                    if (spanElement) {
                        spanElement.textContent = segmentValues[byte];
                    }
                }
            }
        }
    }
    TSOS.MemoryDisplay = MemoryDisplay;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=MemoryDisplay.js.map