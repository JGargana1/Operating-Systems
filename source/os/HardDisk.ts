module TSOS {
    export class HardDisk {
        private diskBlocks: DiskBlock[][][];

        constructor() {
            this.diskBlocks = this.loadFromSessionStorage() || this.initializeDisk();
        }

        private initializeDisk(): DiskBlock[][][] {
            return Array.from({ length: 4 }, () =>
                Array.from({ length: 8 }, () =>
                    Array.from({ length: 8 }, () => new DiskBlock())
                )
            );
        }

        public formatDisk(): void {
            this.diskBlocks = this.initializeDisk();
            this.saveToSessionStorage();
        }

        private loadFromSessionStorage(): DiskBlock[][][] | null {
            const diskData = sessionStorage.getItem('hardDisk');
            return diskData ? JSON.parse(diskData) : null;
        }

        private saveToSessionStorage(): void {
            sessionStorage.setItem('hardDisk', JSON.stringify(this.diskBlocks));
        }

        public displayDisk(): void {
            const diskContainer = document.getElementById('diskDisplay');
            if (!diskContainer) return;
        
            diskContainer.innerHTML = ''; 
        
            let table = document.createElement('table');
            this.diskBlocks.forEach((track, trackIndex) => {
                track.forEach((sector, sectorIndex) => {
                    sector.forEach((block, blockIndex) => {
                        let row = table.insertRow();
                        let cell = row.insertCell();
                        cell.textContent = `T${trackIndex} S${sectorIndex} B${blockIndex}: ` +
                                           `In Use: ${block.inUse}, Key: ${block.directoryKey}, Data: ${block.data}`;
                    });
                });
            });
            diskContainer.appendChild(table);
        }
    }

    
}
