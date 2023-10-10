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

module TSOS {

    export class Cpu {

        

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        
        public run(): void {
            this.isExecuting = true;
            this.cycle();
        }

        
        

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            if (this.isExecuting) {
                if (this.PC < 0 || this.PC >= _MemoryAccessor.getMemorySize()) {
                    _Kernel.krnTrace('Program counter out of memory bounds: ' + this.PC);
                    this.isExecuting = false;
                    return;
                }
                let opCode = _MemoryAccessor.read(this.PC).toUpperCase();  

                


            switch(opCode) {
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
        }

            // TODO: Update the CPU, PCB, and memory displays.
        }
        private loadAccWithConstant(): void {
            try {
                this.PC++;  // Increment to get the constant.
                this.Acc = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Increment to point to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
    
        private loadAccFromMemory(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                this.Acc = parseInt(_MemoryAccessor.read(address), 16);
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        
    
        private storeAccInMemory(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                _MemoryAccessor.write(address, this.Acc.toString(16).toUpperCase());
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        

        // Add with carry. (We assume no overflow handling for simplicity.)
        private addWithCarry(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                this.Acc += parseInt(_MemoryAccessor.read(address), 16);
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        

        // Load the X register with a constant.
        private loadXWithConstant(): void {
            try {
                this.PC++;  // Increment to get the constant.
                this.Xreg = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Increment to point to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        

        // Load the X register from memory.
        private loadXFromMemory(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                this.Xreg = parseInt(_MemoryAccessor.read(address), 16);
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        

        // Load the Y register with a constant.
        private loadYWithConstant(): void {
            try {
                this.PC++;  // Increment to get the constant.
                this.Yreg = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Increment to point to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        // Load the Y register from memory.
        private loadYFromMemory(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                this.Yreg = parseInt(_MemoryAccessor.read(address), 16);
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        

        // Break operation.
        private break(): void {
            this.isExecuting = false;
            
            // Don't increment the PC here.
        }
        

        // Compare a byte in memory to the X register.
        private compareByteToX(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                let value = parseInt(_MemoryAccessor.read(address), 16);
                this.Zflag = (value === this.Xreg) ? 1 : 0;
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        

     
        // Branch n bytes if Z flag = 0.
        private branchNBytesIfZFlagIs0(): void {
            this.PC++;
            if (this.Zflag === 0) {
                let offset = parseInt(_MemoryAccessor.read(this.PC), 16);
                if (offset > 0x7F) {  // If offset is negative in two's complement
                    offset = offset - 0x100;  // Convert to a negative number
                }
                this.PC += offset;
                
        
                // Wrap around if PC exceeds memory size
                while (this.PC >= _MemoryAccessor.getMemorySize()) {
                    this.PC -= _MemoryAccessor.getMemorySize();
                }
            } else {
                this.PC++;
                
            }
        }
        


        // Increment the value of a byte.
        private incrementValueOfByte(): void {
            try {
                let currentOpcode = parseInt(_MemoryAccessor.read(this.PC), 16);
                _Kernel.krnTrace(`Executing opcode ${currentOpcode.toString(16).toUpperCase().padStart(2, '0')} at address ${this.PC}`);

                this.PC++;  // Move to the first byte of the address.
                let lowByte = parseInt(_MemoryAccessor.read(this.PC), 16);
                this.PC++;  // Move to the next address byte.
                let highByte = parseInt(_MemoryAccessor.read(this.PC), 16) << 8;
                let address = lowByte + highByte;
        
                let value = parseInt(_MemoryAccessor.read(address), 16);
                _MemoryAccessor.write(address, (value + 1).toString(16).toUpperCase());
                this.PC++;  // Move to the next opcode.
                
            } catch (error) {
                _Kernel.krnTrace(error.message);
            }
        }
        
        

        
        
        // System Call.
        private systemCall(): void {
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
        
        
        
        
        
        
        
        


    }
}
