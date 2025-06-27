export class LogService {
    private static instance: LogService;

    constructor() {}

    public static getInstance(): LogService {
        if (!LogService.instance) {
            LogService.instance = new LogService();
        }
        return LogService.instance;
    }

    public log(message: string): void {
        console.log(`[LOG] ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} - ${message}`);
    }

    public error(message: string): void {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    }

    public warn(message: string): void {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }
}