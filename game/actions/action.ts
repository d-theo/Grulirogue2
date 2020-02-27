import { MessageResponseStatus, MessageResponse } from "../utils/types";

export class Action {
    totalTime: number;
    remainingTime: number;
    timings?: any[];
    onFinished: any;
    played = false;
    speed: any;
    constructor(arg: {totalTime: number, timing?: any[], onFinished: () => MessageResponse, speed: any}) {
        this.totalTime = arg.totalTime;
        this.remainingTime = arg.totalTime;
        this.speed = arg.speed;
        this.onFinished = arg.onFinished;
    }
    do(): MessageResponse {
        this.played = true;
        if (isNaN(this.speed)) {
            this.remainingTime += this.speed();
        } else {
            this.remainingTime += this.speed;
        }
        if (this.remainingTime >= this.totalTime) {
            return this.onFinished();
        } else {
            return {
                status: MessageResponseStatus.InProgress
            }
        }
    }
}