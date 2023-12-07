module TSOS {
    export class HardDisk {
        public diskBlocks: DiskBlock[][][];
        public formatted: boolean;  

        constructor() {
            const loadedData = this.loadFromSessionStorage();
            this.diskBlocks = loadedData ? loadedData.diskBlocks : this.initializeDisk();
            this.formatted = loadedData ? loadedData.formatted : false;
        }

        public formatDisk(): void {
            this.diskBlocks = this.initializeDisk();
            this.formatted = true;
            this.saveToSessionStorage();
        }

        private initializeDisk(): DiskBlock[][][] {
            return Array.from({ length: 4 }, () =>
                Array.from({ length: 8 }, () =>
                    Array.from({ length: 8 }, () => new DiskBlock())
                )
            );
        }

        

        public loadFromSessionStorage(): { diskBlocks: DiskBlock[][][], formatted: boolean } | null {
            const diskData = sessionStorage.getItem('hardDisk');
            if (diskData) {
                const parsedData = JSON.parse(diskData);
                return parsedData;
            }
            return null;
        }

        public saveToSessionStorage(): void {
            const diskData = { diskBlocks: this.diskBlocks, formatted: this.formatted };
            sessionStorage.setItem('hardDisk', JSON.stringify(diskData));
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
