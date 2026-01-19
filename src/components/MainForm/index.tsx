import { PlayCircleIcon, StopCircleIcon } from "lucide-react";
import { DefaultButton } from "../DefaultButton";
import { DefaultInput } from "../DefaultInput";
import { Cycles } from "../Cycles";
import { useRef } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";
import { getNextCycleType } from "../../utils/getNextCycleType";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";
import { Tips } from "../Tips";
import { showMessage } from "../../adapters/showMessage";

export function MainForm() {
    const taskNameInput = useRef<HTMLInputElement>(null);
    const { state, dispatch } = useTaskContext();
    const lastTaskName = state.tasks[state.tasks.length - 1]?.name;

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);


    function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!taskNameInput.current) return;

        const taskName = taskNameInput.current.value.trim(); // Remove os espaços antes e depois da string. ex: ' valor ' = 'valor'

        if (!taskName) {
            showMessage.warning("Digite o nome da tarefa");
            return;
        }

        const newTask: TaskModel = {
            id: Date.now().toString(),
            name: taskName,
            startDate: Date.now(),
            completeDate: null,
            interruptDate: null,
            duration: state.config[nextCycleType],
            type: nextCycleType
        };

        dispatch({ type: TaskActionTypes.START_TASK, payload: newTask })
    }

    function handleInterruptTask(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        showMessage.error('Tarefa Interrompida!');
        dispatch({ type: TaskActionTypes.INTERRUPT_TASK });
    }

    // {console.log('state:', state)}
    // {console.log('activeTask:', state.activeTask)}
    return (
        <form onSubmit={handleCreateNewTask} className="form" action="">
            <div className="formRow">
                <DefaultInput
                    id="meuInput"
                    type="text"
                    labelText="Task"
                    placeholder="Digite algo"
                    ref={taskNameInput}
                    disabled={!!state.activeTask}
                    defaultValue={lastTaskName} // nâo precisa controlar o valor
                />
            </div>
            <div className="formRow">
                <Tips />
            </div>
            {state.currentCycle > 0 && (
                <div className="formRow">
                    <Cycles />
                </div>
            )}
            <div className="formRow">
                {!state.activeTask ? (
                    <DefaultButton
                        type="submit"
                        icon={<PlayCircleIcon />}
                        color="green"
                        aria-label="Iniciar uma nova tarefa"
                        title="Iniciar uma nova tarefa" />
                ) : (
                    <DefaultButton
                        type='button'
                        icon={<StopCircleIcon />}
                        color="red"
                        title="Interromper a tarefa atual"
                        aria-label="Interromper a tarefa atual"
                        onClick={handleInterruptTask}
                    />
                )}

            </div>
        </form>
    );
}