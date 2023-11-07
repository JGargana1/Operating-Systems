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

        public displayMemory(memory: Memory): void {
            const container = document.getElementById('memory-segment-container');
            if (!container) {
                console.error('Memory segment container not found.');
                return;
            }

            container.innerHTML = '';
    
            memory.memorySegments.forEach((segment, segmentIndex) => {
                const segmentDiv = document.createElement('div');
                segmentDiv.className = 'memory-segment';
                segmentDiv.id = `segment-${segmentIndex}`;
    
                const segmentTitle = document.createElement('h3');
                segmentTitle.textContent = `Segment ${segmentIndex + 1}`;
                segmentDiv.appendChild(segmentTitle);
    
                const table = document.createElement('table');
                for (let i = 0; i < memory.segmentSize / 8; i++) {
                    const tr = document.createElement('tr');
                    for (let j = 0; j < 8; j++) {
                        const td = document.createElement('td');
                        td.textContent = segment[i * 8 + j];
                        td.id = `segment-${segmentIndex}-byte-${i * 8 + j}`; 
                        tr.appendChild(td);
                    }
                    table.appendChild(tr);
                }
                segmentDiv.appendChild(table);
                container.appendChild(segmentDiv);
            });
        }
        public updateMemoryDisplay(segment: number, address: number, value: string): void {
            const byteId = `segment-${segment}-byte-${address}`;
            const byteElement = document.getElementById(byteId);
            if (byteElement) {
                byteElement.textContent = value;
            }
        }

            
        
    }
}
