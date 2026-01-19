import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";
import { getNextCycleType } from "../../utils/getNextCycleType";

export function Tips() {
    const { state } = useTaskContext();
    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    const tipsForWhenActiveTask = {
        workTime: (
            <span>Foque por {state.config.workTime} mins</span>
        ),
        shortBreakTime: (
            <span>Descanse por {state.config.shortBreakTime} mins</span>
        ),
        longBreakTime: (
            <span>Descanso longo de {state.config.longBreakTime} mins</span>
        )
    }

    const tipsNoActiveTask = {
        workTime: (
            <span>O próximo ciclo é de {state.config.workTime} mins</span>
        ),
        shortBreakTime: (
            <span>O próximo ciclo de descanso é de {state.config.shortBreakTime} mins</span>
        ),
        longBreakTime: (
            <span>O próximo ciclo de descanso é de {state.config.longBreakTime} mins</span>
        )
    }
    return (
        <>
            {!!state.activeTask && tipsForWhenActiveTask[state.activeTask.type]}
            {!state.activeTask && tipsNoActiveTask[nextCycleType]}
        </>
    )
}