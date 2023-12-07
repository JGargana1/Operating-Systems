var TSOS;
(function (TSOS) {
    class HardDisk {
        diskBlocks;
        formatted;
        constructor() {
            const loadedData = this.loadFromSessionStorage();
            this.diskBlocks = loadedData ? loadedData.diskBlocks : this.initializeDisk();
            this.formatted = loadedData ? loadedData.formatted : false;
        }
        formatDisk() {
            this.diskBlocks = this.initializeDisk();
            this.formatted = true;
            this.saveToSessionStorage();
        }
        initializeDisk() {
            return Array.from({ length: 4 }, () => Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => new TSOS.DiskBlock())));
        }
        loadFromSessionStorage() {
            const diskData = sessionStorage.getItem('hardDisk');
            if (diskData) {
                const parsedData = JSON.parse(diskData);
                return parsedData;
            }
            return null;
        }
        saveToSessionStorage() {
            const diskData = { diskBlocks: this.diskBlocks, formatted: this.formatted };
            sessionStorage.setItem('hardDisk', JSON.stringify(diskData));
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