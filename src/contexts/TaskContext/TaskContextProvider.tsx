import { useEffect, useState } from "react";
import { initialTaskState } from "./initialTaskState";
import { TaskContext } from "./TaskContext";

// sempre o reduce tem que retornar o estado atualizado ou o estado atual
//use reduce usa uma função com 2 variaveis. a gente dispara um ação para ele e ele muda o estado

type TaskContextProviderProps = {
    children: React.ReactNode
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, setState] = useState(initialTaskState);

    useEffect(() =>{
        console.log(state)
    }, [state]);

    return (
        <TaskContext.Provider value={{ state, setState }}>
            {children}
        </TaskContext.Provider>
    );
}