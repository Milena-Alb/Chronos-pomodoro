import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplates';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { formatDate } from '../../utils/formateDate';
import styles from './styles.module.css';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTask';
import { useEffect, useState } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { showMessage } from '../../adapters/showMessage';

export function History() {
    const { state, dispatch } = useTaskContext()
    const hasTasks = state.tasks.length > 0;
    const [confirmClearHistory, setConfirmClearHistory] = useState(false);

    useEffect(() => {
        document.title = 'Histórico';
    }, [])
    const [sortedTaksOption, setSortedTaksOption] = useState<SortTasksOptions>(
        () => {
            return {
                tasks: sortTasks({ tasks: state.tasks }),
                field: 'startDate',
                direction: 'desc',
            };
        },
    );

    useEffect(() => {
        setSortedTaksOption(prevState => ({
            ...prevState,
            tasks: sortTasks({
                tasks: state.tasks,
                direction: prevState.direction,
                field: prevState.field,
            }),
        }));
    }, [state.tasks]);

    useEffect(() => {
        if (!confirmClearHistory) return;

        setConfirmClearHistory(false);

    }, [confirmClearHistory, dispatch]);

    useEffect(() => {
        return () => {
            showMessage.dissmiss();
        };
    })

    function handleSortTask({ field }: Pick<SortTasksOptions, 'field'>) {
        const newDirection = sortedTaksOption.direction === 'desc' ? 'asc' : 'desc'
        setSortedTaksOption({
            tasks: sortTasks({
                direction: newDirection,
                tasks: sortedTaksOption.tasks,
                field,
            }),
            direction: newDirection,
            field,
        })
    }

    function handleResetHistory() {
        showMessage.confirm('Tem certeza que deseja excluir?', (confimation) => {
            setConfirmClearHistory(confimation);
            if (confimation) {
                dispatch({ type: TaskActionTypes.RESET_STATE });
            }
        })
    }

    return (
        <MainTemplate>
            <Container>
                <Heading>
                    <span>History</span>
                    {hasTasks && (
                        <span className={styles.buttonContainer}>
                            <DefaultButton
                                icon={<TrashIcon />}
                                color='red'
                                aria-label='Apagar todo o histórico'
                                title='Apagar histórico'
                                onClick={handleResetHistory}
                            />
                        </span>
                    )}
                </Heading>
            </Container>

            <Container>
                {hasTasks && (
                    <div className={styles.responsiveTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th className={styles.thSort} onClick={() => handleSortTask({ field: 'name' })}>Tarefa ↕</th>
                                    <th className={styles.thSort} onClick={() => handleSortTask({ field: 'duration' })}>Duração ↕</th>
                                    <th className={styles.thSort} onClick={() => handleSortTask({ field: 'startDate' })}>Data ↕</th>
                                    <th>Status</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedTaksOption.tasks.map(task => {
                                    const taskTypeDictionary = {
                                        workTime: 'Foco',
                                        shortBreakTime: 'Descanso curto',
                                        longBreakTime: 'Descanso longo',
                                    };

                                    return (
                                        <tr key={task.id}>
                                            <td>{task.name}</td>
                                            <td>{task.duration}</td>
                                            <td>{formatDate(task.startDate)}</td>
                                            <td>{getTaskStatus(task, state.activeTask)}</td>
                                            <td>{taskTypeDictionary[task.type]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {!hasTasks && (
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Ainda nâo existe tarefas criadas
                    </p>
                )}
            </Container>
        </MainTemplate>
    );
}