module TSOS {
    export class diskDrivers{

        
        public findFreeDataBlock(): { key: string, block: DiskBlock } | null {
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
        
        public updateDirectoryBlock(pidHexString: string, dataBlockKey: string): void {
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
        
        public updateBlockKey(previousKey: string, nextBlockKey: string): void {
            // Update the directory key of a block to point to the next block
            let [track, sector, block] = previousKey.split('').map(Number);
            let prevBlock = _HardDisk.diskBlocks[track][sector][block];
            prevBlock.directoryKey = nextBlockKey;
        }

        public convertToHex(str: string): string {
            return str.split('').map(char => char.charCodeAt(0).toString(16)).join('');
        }

        public doesFileExist(filenameHex: string): boolean {
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
        
        public findFreeDirectoryBlock(): DiskBlock | null {
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

        public findDirectoryBlock(filenameHex: string): DiskBlock | null {
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
        
        public writeDataToDisk(startKey: string, dataHex: string): void {
            let currentKey = startKey;
            const dataChunks = this.splitIntoChunks(dataHex, 60);
        
            for (const chunk of dataChunks) {
                const [track, sector, block] = currentKey.split('').map(Number);
                const dataBlock = _HardDisk.diskBlocks[track][sector][block];
        
                dataBlock.data = chunk.padEnd(60, "0");
                currentKey = dataBlock.directoryKey; 
            }
        }
        
        public splitIntoChunks(str: string, chunkSize: number): string[] {
            const chunks = [];
            for (let i = 0; i < str.length; i += chunkSize) {
                chunks.push(str.substring(i, i + chunkSize));
            }
            return chunks;
        }

        public readDataFromDisk(startKey: string): string {
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
        
        public convertHexToString(hexStr: string): string {
            let str = "";
            for (let i = 0; i < hexStr.length; i += 2) {
                const byte = hexStr.substr(i, 2);
                if (byte !== "00") {
                    str += String.fromCharCode(parseInt(byte, 16));
                }
            }
            return str;
        }

        public getDataBlocks(startKey: string): DiskBlock[] {
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
}