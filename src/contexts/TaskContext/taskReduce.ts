import type { TaskStateModel } from "../../models/TaskStateModel";
import { formattedSecondsToMinutes } from "../../utils/formatSecondToMinutes";
import { getNextCycle } from "../../utils/getNextCycle";
import { initialTaskState } from "./initialTaskState";
import type { TaskActionModel } from "./taskActions";

export function TaskReduce(state: TaskStateModel, action: TaskActionModel) {
    // sempre o reduce tem que retornar o estado atualizado ou o estado atual
    //use reduce usa uma função com 2 variaveis. a gente dispara um ação para ele e ele muda o estado

    switch (action.type) {
        case 'START_TASK': {
            const newTask = action.payload;
            const nextCycle = getNextCycle(state.currentCycle);
            const secondsRemaining = newTask.duration * 60;

            return {
                ...state,
                activeTask: newTask,
                currentCycle: nextCycle,
                secondsRemaining,
                formattedSecondsRemaining: formattedSecondsToMinutes(secondsRemaining),
                tasks: [...state.tasks, newTask]
            };
        }
        case 'INTERRUPT_TASK': {
            return {
                ...state,
                activeTask: null,
                secondsRemaining: 0,
                formattedSecondsRemaining: '00:00',
                tasks: state.tasks.map(task => {
                    if (state.activeTask && state.activeTask.id === task.id) {
                        return { ...task, interruptDate: Date.now() };
                    }
                    return task;
                }),
            };
        }
        case 'COMPLETE_TASK': {
            return {
                ...state,
                activeTask: null,
                secondsRemaining: 0,
                formattedSecondsRemaining: '00:00',
                tasks: state.tasks.map(task => {
                    if (state.activeTask && state.activeTask.id === task.id) {
                        return { ...task, completeDate: Date.now() };
                    }
                    return task;
                }),
            };
        }
        case 'COUNT_DOWN': {
            return {
                ...state,
                secondsRemaining: action.payload.secondsRemaining,
                formattedSecondsRemaining: formattedSecondsToMinutes(
                    action.payload.secondsRemaining,
                ),
            };

        }
        case 'RESET_STATE': {
            return { ...initialTaskState };
        }

        case 'CHANGE_SETTINGS': {
            return { ...state, config:{...action.payload} };
        }
    }
    return state;

}

