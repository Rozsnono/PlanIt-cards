export class Timer {

    public time = 0;
    public interval: NodeJS.Timeout | null = null;

    constructor() {}

    public start() {
        this.setTime();
        this.interval = setInterval(() => {
            this.time = parseInt((this.getTime() / 1000).toFixed(0));
        }, 1000);
    }

    public stop() {
        if (this.interval) {
            this.clearTime();
            this.time = 0;
            clearInterval(this.interval);
        }
    }

    private getTime() {
        if(localStorage.getItem('planit-time')) {
            this.time = new Date().getTime() - parseInt(localStorage.getItem('planit-time')!);
        }
        return this.time;
    }

    private setTime() {
        if(localStorage.getItem('planit-time')) return;
        localStorage.setItem('planit-time', new Date().getTime().toString());
    }

    private clearTime() {
        localStorage.removeItem('planit-time');
    }
}

export const timerClass = new Timer();