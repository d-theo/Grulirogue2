export enum MessageResponseStatus {
    Ok=1,
    Error=2,
    NotAllowed=3,
}
export interface MessageResponse {
    timeSpent: number;
    status: MessageResponseStatus;
    data?: any;
    events?: any[];
}