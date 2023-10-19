/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        PC;
        Acc;
        Xreg;
        Yreg;
        Zflag;
        isExecuting;
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        run() {
            this.isExecuting = true;
            this.updateStatus('running');
            this.cycle();
        }
        logStatus() {
            console.log(`----- CPU Status -----`);
            console.log(`Program Counter (PC): ${this.PC}`);
            console.log(`Instruction Register (Opcode): ${_MemoryAccessor.read(this.PC)}`);
            console.log(`Accumulator (Acc): ${this.Acc}`);
            console.log(`X Register (Xreg): ${this.Xreg}`);
            console.log(`Y Register (Yreg): ${this.Yreg}`);
            console.log(`Z Flag (Zflag): ${this.Zflag}`);
            console.log(`Is Executing: ${this.isExecuting}`);
            console.log(`----------------------`);
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            if (this.isExecuting) {
                if (this.PC < 0 || this.PC >= _MemoryAccessor.getMemorySize()) {
                    _Kernel.krnTrace('Program counter out of memory bounds: ' + this.PC);
                    this.isExecuting = false;
                    this.updateStatus('terminated');
                    return;
                }
                let opCode = _MemoryAccessor.read(this.PC).toUpperCase();
                switch (opCode) {
                    case "A9":
                        this.loadAccWithConstant();
                        break;
                    case "AD":
                        this.loadAccFromMemory();
                        break;
                    case "8D":
                        this.storeAccInMemory();
                        break;
                    case "6D":
                        this.addWithCarry();
                        break;
                    case "A2":
                        this.loadXWithConstant();
                        break;
                    case "AE":
                        this.loadXFromMemory();
                        break;
                    case "A0":
                        this.loadYWithConstant();
                        break;
                    case "AC":
                        this.loadYFromMemory();
                        break;
                    case "EA":
                        // NOP - No operation needed.
                        this.PC++;
                        break;
                    case "00":
                        this.break();
                        break;
                    case "EC":
                        this.compareByteToX();
                        break;
                    case "D0":
                        this.branchNBytesIfZFlagIs0();
                        break;
                    case "EE":
                        this.incrementValueOfByte();
                        break;
                    case "FF":
                        this.systemCall();
                        break;
                    default:
                        // Handle invalid opcode.
                        this.isExecuting = false;
                        _Kernel.krnTrace("Invalid OP code: " + opCode);
                        break;
                }
                this.displayCPUStatus();
            }
            // TODO: Update the CPU, PCB, and memory displays.
        }
        loadAccWithConstant() {
            try {
                this.PC++; // Increment to get the constant.
                this.Acc = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Increment to point to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        loadAccFromMemory() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                this.Acc = parseInt(_MemoryAccessor.read(address), 16);
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        storeAccInMemory() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                _MemoryAccessor.write(address, this.Acc.toString(16).toUpperCase());
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Add with carry. (We assume no overflow handling for simplicity.)
        addWithCarry() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                this.Acc += parseInt(_MemoryAccessor.read(address), 16);
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Load the X register with a constant.
        loadXWithConstant() {
            try {
                this.PC++; // Increment to get the constant.
                this.Xreg = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Increment to point to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Load the X register from memory.
        loadXFromMemory() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                this.Xreg = parseInt(_MemoryAccessor.read(address), 16);
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Load the Y register with a constant.
        loadYWithConstant() {
            try {
                this.PC++; // Increment to get the constant.
                this.Yreg = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Increment to point to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Load the Y register from memory.
        loadYFromMemory() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                this.Yreg = parseInt(_MemoryAccessor.read(address), 16);
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Break operation.
        break() {
            this.isExecuting = false;
            // Don't increment the PC here.
        }
        // Compare a byte in memory to the X register.
        compareByteToX() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                let value = parseInt(_MemoryAccessor.read(address), 16);
                this.Zflag = (value === this.Xreg) ? 1 : 0;
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // Branch n bytes if Z flag = 0.
        branchNBytesIfZFlagIs0() {
            this.PC++;
            if (this.Zflag === 0) {
                let offset = parseInt(_MemoryAccessor.read(this.PC), 16);
                let old = this.PC;
                this.PC = (this.PC + 1 + offset) % _MemoryAccessor.getMemorySize();
                console.log("Jumping from ", old, " to ", this.PC);
            }
            else {
                this.PC++;
            }
        }
        // Increment the value of a byte.
        incrementValueOfByte() {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);
                this.PC++; // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++; // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
                let value = parseInt(_MemoryAccessor.read(address), 16);
                _MemoryAccessor.write(address, (value + 1).toString(16).toUpperCase());
                this.PC++; // Move to the next opcode.
            }
            catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        // System Call.
        systemCall() {
            // Tracing the system call
            _Kernel.krnTrace(`System call with X register: ${this.Xreg.toString(16)}`);
            // If X register is 0x01, print the integer in Y register
            if (this.Xreg === 0x01) {
                let output = this.Yreg.toString();
                _Kernel.krnTrace('System Call Output: ' + output);
                _StdOut.putText(output);
            }
            // If X register is 0x02, print the 00-terminated string stored at the address in Y register
            else if (this.Xreg === 0x02) {
                let str = '';
                let byte = _MemoryAccessor.read(this.Yreg);
                while (byte !== "00" && this.Yreg < _MemoryAccessor.getMemorySize()) {
                    str += String.fromCharCode(parseInt(byte, 16));
                    this.Yreg++;
                    byte = _MemoryAccessor.read(this.Yreg);
                }
                _Kernel.krnTrace('System Call Output: ' + str);
                _StdOut.putText(str);
            }
            else {
                let unrecognizedOutput = 'Unrecognized system call with X register: ' + this.Xreg.toString(16);
                _Kernel.krnTrace(unrecognizedOutput);
                _StdOut.putText(unrecognizedOutput);
            }
            this.PC++;
        }
        displayCPUStatus() {
            // Display CPU Status in console logs
            console.log("CPU Status:");
            console.log("Program Counter:", this.PC);
            console.log("Instruction Register:", _MemoryAccessor.read(this.PC).toUpperCase());
            console.log("Accumulator:", this.Acc);
            console.log("X Register:", this.Xreg);
            console.log("Y Register:", this.Yreg);
            console.log("Z Flag:", this.Zflag);
        }
        updateStatus(status) {
            // Update and log the status of the PCB
            switch (status) {
                case 'loaded':
                    console.log("PCB Status: Resident");
                    break;
                case 'running':
                    console.log("PCB Status: Running");
                    break;
                case 'terminated':
                    console.log("PCB Status: Terminated");
                    break;
                default:
                    console.log("PCB Status: Unknown");
                    break;
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map