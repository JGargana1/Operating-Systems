module TSOS {
    export class Memory {
        public memorySegments: string[][];
        public byteOccupiedFlags: boolean[][];

        constructor(public segments: number = 3, public segmentSize: number = 256) {
            this.memorySegments = new Array(segments).fill(null).map(_ => new Array(segmentSize).fill("00"));
            this.byteOccupiedFlags = new Array(segments).fill(null).map(_ => new Array(segmentSize).fill(false));
        }

        public init(): void {
            for (let segment = 0; segment < this.segments; segment++) {
                for (let i = 0; i < this.segmentSize; i++) {
                    this.memorySegments[segment][i] = "00";
                    this.byteOccupiedFlags[segment][i] = false;
                }
            }
        }

        public generateMemoryDisplay() {
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

          public static resetMemoryDisplay(): void {
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
}
