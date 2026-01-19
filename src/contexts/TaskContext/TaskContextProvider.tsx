import { useEffect, useReducer, useRef } from "react";
import { initialTaskState } from "./initialTaskState";
import { TaskContext } from "./TaskContext";
import { TaskReduce } from "./taskReduce";
import { TimerWorkerManager } from "../../Workers/TimerWorkerManager";
import { TaskActionTypes } from "./taskActions";
import { loadBeep } from "../../utils/loadBeep";
import type { TaskStateModel } from "../../models/TaskStateModel";

type TaskContextProviderProps = {
    children: React.ReactNode
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, dispatch] = useReducer(TaskReduce, initialTaskState, () => {
        const storageState = localStorage.getItem('state') || null;
        if (storageState === null) return initialTaskState;

        const parsedStoragestate = JSON.parse(storageState) as TaskStateModel;

        return {
            ...parsedStoragestate,
            activeTask: null,
            secondsRemaining: 0,
            formattedSecondsRemaining: '00:00',
        };
    }); 
    const worker = TimerWorkerManager.getIntance();
    const playBeepRef = useRef<() => void>(null);

    worker.onMessage((e) => {
        const countDownSeconds = e.data;
        if (countDownSeconds <= 0) {
            if(playBeepRef.current){
                playBeepRef.current();
                playBeepRef.current = null;
            }
            dispatch({
                type:TaskActionTypes.COMPLETE_TASK,
            });
            worker.terminate();

        } else {
            dispatch({
                type:TaskActionTypes.COUNT_DOWN,
                payload: { secondsRemaining: countDownSeconds },
            });
        }
    })

    useEffect(() => {
        if(!state.activeTask ){
            localStorage.setItem('state', JSON.stringify(state));
            worker.terminate();
        }

        document.title = `${state.formattedSecondsRemaining} - Chromos Pomodoro`

        worker.postMessage(state);
    }, [worker, state]);

    useEffect(() => {
        if(state.activeTask && playBeepRef.current === null){
            playBeepRef.current = loadBeep();
        } else {
            playBeepRef.current = null;
        }
    },[state.activeTask])

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
}