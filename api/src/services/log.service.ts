export class LogService {
    constructor() { }

    public consoleLog(message: string, service: string = 'LogService'): void {
        console.log(`${this.checkZeroPadding(new Date().getHours())}:${this.checkZeroPadding(new Date().getMinutes())}:${this.checkZeroPadding(new Date().getSeconds())} | [${service}] |  ${message}`);
    }

    private checkZeroPadding(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}