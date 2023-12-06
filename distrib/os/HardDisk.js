var TSOS;
(function (TSOS) {
    class HardDisk {
        diskBlocks;
        constructor() {
            this.diskBlocks = this.loadFromSessionStorage() || this.initializeDisk();
        }
        initializeDisk() {
            return Array.from({ length: 4 }, () => Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => new TSOS.DiskBlock())));
        }
        formatDisk() {
            this.diskBlocks = this.initializeDisk();
            this.saveToSessionStorage();
        }
        loadFromSessionStorage() {
            const diskData = sessionStorage.getItem('hardDisk');
            return diskData ? JSON.parse(diskData) : null;
        }
        saveToSessionStorage() {
            sessionStorage.setItem('hardDisk', JSON.stringify(this.diskBlocks));
        }
        displayDisk() {
            const diskContainer = document.getElementById('diskDisplay');
            if (!diskContainer)
                return;
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
    TSOS.HardDisk = HardDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=HardDisk.js.map