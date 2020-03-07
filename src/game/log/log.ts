export class Log {
    currentLog: string[];
    allLog: string[];
    constructor() {
        this.currentLog = [];
        this.allLog = [];
    }

    add(log: string) {
        this.currentLog.push(log);
    }
    getLog() {
        return this.currentLog;
    }
    getFullLog() {
        return this.allLog;
    }
    archive() {
        this.allLog = this.allLog.concat(this.currentLog);
        this.currentLog = [];
    }
}