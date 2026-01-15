import { PlayCircleIcon, StopCircleIcon } from "lucide-react";
import { DefaultButton } from "../DefaultButton";
import { DefaultInput } from "../DefaultInput";
import { Cycles } from "../Cycles";
import { useRef } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";
import { getNextCycleType } from "../../utils/getNextCycleType";
import { formattedSecondsToMinutes } from "../../utils/formatSecondToMinutes";

export function MainForm() {
    const taskNameInput = useRef<HTMLInputElement>(null);
    const { state, setState } = useTaskContext();

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!taskNameInput.current) return;

        const taskName = taskNameInput.current.value.trim(); // Remove os espaços antes e depois da string. ex: ' valor ' = 'valor'

        if (!taskName) {
            alert("Digite o nome da tarefa");
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

        const secondsRemaining = newTask.duration * 60;

        setState(prevState => {
            return {
                ...prevState,
                config: { ...prevState.config },
                activeTask: newTask,
                currentCycle: nextCycle,
                secondsRemaining,
                formattedSecondsRemaining: formattedSecondsToMinutes(secondsRemaining),
                tasks: [...prevState.tasks, newTask]
            };
        });
    }

    function handleInterruptTask(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setState(prevState => {
            return {
                ...prevState,
                activeTask: null,
                secondsRemaining: 0,
                formattedSecondsRemaining: '00:00',
                tasks: prevState.tasks.map(task => {
                    if (prevState.activeTask && prevState.activeTask.id === task.id){
                        return { ...task, interruptDate: Date.now()};
                    }
                    return task;
                }),
            };
        });

    }

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
                />
            </div>
            <div className="formRow">
                <p>O próximo ciclo é de {state.config[nextCycleType]} mins</p>
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