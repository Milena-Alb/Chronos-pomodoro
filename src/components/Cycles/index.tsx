import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import styles from './styles.module.css';

export function Cycles() {
    const { state } = useTaskContext();
    //const cycleStep = Array(5).fill(null); array com 5 posições nulas
    const cycleStep = Array.from({ length: state.currentCycle });  //array com 5 posições underfine

    const cycleDescriptionMap = {
        workTime: 'foco',
        shortBreakTime: 'Descanso curto',
        longBreakTime: 'Desacanso longo'
    }
    return (
        <div className={styles.cycles}>
            <span>Ciclos:</span>
            <div className={styles.cycleDots}>
                {cycleStep.map((_, index) => {
                    const nextCycle = getNextCycle(index);
                    const nextCycleType = getNextCycleType(nextCycle);
                    return (
                        <span
                            key={`${nextCycle}`}
                            className={`${styles.cycleDot} ${styles[nextCycleType]}`}
                            aria-label={`Indicador de ciclo de ${cycleDescriptionMap}`}
                            title={`Indicador de ciclo de foco ${cycleDescriptionMap}`}>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}