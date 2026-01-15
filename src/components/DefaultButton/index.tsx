import styles from './styles.module.css';

type DefaultButtonProps = {
    icon: React.ReactNode;
    color?: 'green' | 'red';
} & React.ComponentProps<'button'>

export function DefaultButton( {icon, color='green', ...rest}: DefaultButtonProps) { //rest - qualquer coisa que for informado lá, ele pega, como titulo
    return (
        <>
            <button {...rest} className={`${styles.button} ${styles[color]}`}>
                {icon}
            </button>
        </>
    );
}