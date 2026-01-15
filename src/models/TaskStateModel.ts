import type { TaskModel } from "./TaskModel";

export type TaskStateModel = {
    tasks: TaskModel[]; // Histórico, MainForm
    secondsRemaining: number; // CountDown, Histórico, MainForm, Button
    formattedSecondsRemaining: string; // Título, CountDown
    activeTask: TaskModel | null; // CountDown, Histórico, MainForm, Button
    currentCycle: number; // Home
    config: {
        workTime:number; // MainForm
        shortBreakTime: number; // MainForm
        longBreakTime: number; // MainForm
    };
};