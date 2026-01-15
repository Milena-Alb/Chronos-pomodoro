import type { TaskStateModel } from "./TaskStateModel";

export type TaskModel = {
    id: string;
    name: string;
    duration: number;
    startDate: number; 
    completeDate: number | null;  //quando o time chega ao final
    interruptDate: number | null; // quando o time for interrompido
    type: keyof TaskStateModel['config'];
};
