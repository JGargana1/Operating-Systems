var TSOS;
(function (TSOS) {
    class diskDrivers {
        findFreeDataBlock() {
            // Find a free data block in Tracks 1-3
            for (let track = 1; track < 4; track++) {
                for (let sector = 0; sector < 8; sector++) {
                    for (let block = 0; block < 8; block++) {
                        let dataBlock = _HardDisk.diskBlocks[track][sector][block];
                        if (dataBlock.inUse === "0") {
                            return { key: `${track}${sector}${block}`, block: dataBlock };
                        }
                    }
                }
            }
            return null;
        }
        updateDirectoryBlock(pidHexString, dataBlockKey) {
            // Start searching from Sector 0, Block 1 to avoid the MBR
            for (let sector = 0; sector < 8; sector++) {
                for (let block = (sector == 0 ? 1 : 0); block < 8; block++) {
                    let dirBlock = _HardDisk.diskBlocks[0][sector][block];
                    if (dirBlock.inUse === "0") {
                        dirBlock.inUse = "1";
                        dirBlock.directoryKey = dataBlockKey;
                        dirBlock.data = pidHexString.padEnd(60, "0");
                        return;
                    }
                }
            }
            throw new Error("No free directory block found");
        }
        updateBlockKey(previousKey, nextBlockKey) {
            // Update the directory key of a block to point to the next block
            let [track, sector, block] = previousKey.split('').map(Number);
            let prevBlock = _HardDisk.diskBlocks[track][sector][block];
            prevBlock.directoryKey = nextBlockKey;
        }
        convertToHex(str) {
            return str.split('').map(char => char.charCodeAt(0).toString(16)).join('');
        }
        doesFileExist(filenameHex) {
            for (let sector = 0; sector < 8; sector++) {
                for (let block = 0; block < 8; block++) {
                    let dirBlock = _HardDisk.diskBlocks[0][sector][block];
                    if (dirBlock.inUse === "1" && dirBlock.data.startsWith(filenameHex)) {
                        return true;
                    }
                }
            }
            return false;
        }
        findFreeDirectoryBlock() {
            for (let sector = 0; sector < 8; sector++) {
                for (let block = 1; block < 8; block++) {
                    let dirBlock = _HardDisk.diskBlocks[0][sector][block];
                    if (dirBlock.inUse === "0") {
                        return dirBlock;
                    }
                }
            }
            return null;
        }
        findDirectoryBlock(filenameHex) {
            for (let sector = 0; sector < 8; sector++) {
                for (let block = 0; block < 8; block++) {
                    let dirBlock = _HardDisk.diskBlocks[0][sector][block];
                    if (dirBlock.inUse === "1" && dirBlock.data.startsWith(filenameHex)) {
                        return dirBlock;
                    }
                }
            }
            return null;
        }
        writeDataToDisk(startKey, dataHex) {
            let currentKey = startKey;
            const dataChunks = this.splitIntoChunks(dataHex, 60);
            for (const chunk of dataChunks) {
                const [track, sector, block] = currentKey.split('').map(Number);
                const dataBlock = _HardDisk.diskBlocks[track][sector][block];
                dataBlock.data = chunk.padEnd(60, "0");
                currentKey = dataBlock.directoryKey;
            }
        }
        splitIntoChunks(str, chunkSize) {
            const chunks = [];
            for (let i = 0; i < str.length; i += chunkSize) {
                chunks.push(str.substring(i, i + chunkSize));
            }
            return chunks;
        }
        readDataFromDisk(startKey) {
            let currentKey = startKey;
            let dataHex = "";
            while (currentKey !== "000" && currentKey) {
                const [track, sector, block] = currentKey.split('').map(Number);
                const dataBlock = _HardDisk.diskBlocks[track][sector][block];
                dataHex += dataBlock.data;
                currentKey = dataBlock.directoryKey;
            }
            return dataHex;
        }
        convertHexToString(hexStr) {
            let str = "";
            for (let i = 0; i < hexStr.length; i += 2) {
                const byte = hexStr.substr(i, 2);
                if (byte !== "00") {
                    str += String.fromCharCode(parseInt(byte, 16));
                }
            }
            return str;
        }
        getDataBlocks(startKey) {
            let currentKey = startKey;
            const blocks = [];
            while (currentKey !== "000" && currentKey) {
                const [track, sector, block] = currentKey.split('').map(Number);
                const dataBlock = _HardDisk.diskBlocks[track][sector][block];
                blocks.push(dataBlock);
                currentKey = dataBlock.directoryKey;
            }
            return blocks;
        }
    }
    TSOS.diskDrivers = diskDrivers;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskDrivers.js.map