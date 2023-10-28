module TSOS {

    export class UpdateMemoryDisplay {
        
        constructor() {
            this.init();
        }

        private init(): void {
            document.addEventListener("DOMContentLoaded", () => this.generateMemoryTables());
        }

        private generateMemoryTables(): void {
            for (let i = 1; i <= 3; i++) {
                this.generateMemoryTable(i);
            }
        }

        private generateMemoryTable(segmentNumber: number): void {
            // Reference to your main display div
            let displayDiv: HTMLElement | null = document.getElementById('divMemoryDisplay');
            if (!displayDiv) return;

            // Create table and label
            let table: HTMLTableElement = document.createElement('table');
            let label: HTMLLabelElement = document.createElement('label');
            label.innerHTML = "Memory Segment " + segmentNumber + "<br>";
            table.border = "1";

            // Rows in table
            for (let i = 0; i < 16; i++) {  
                let row: HTMLTableRowElement = table.insertRow();

                // First cell will be the address
                let addressCell: HTMLTableCellElement = row.insertCell();
                addressCell.innerHTML = "0x" + (i * 8).toString(16).toUpperCase().padStart(3, '0');

                // The rest will be data cells
                for (let j = 0; j < 8; j++) {
                    let cell: HTMLTableCellElement = row.insertCell();
                    cell.innerHTML = "00"; // Default value
                }
            }

            // Append the label and table to the div
            displayDiv.appendChild(label);
            displayDiv.appendChild(table);
            displayDiv.appendChild(document.createElement('br'));
        }
    }
}
