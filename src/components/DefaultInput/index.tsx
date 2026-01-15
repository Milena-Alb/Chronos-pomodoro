import styles from './styles.module.css';

type DefaultInputProps = {
    id: string;
    labelText?: string;
} & React.ComponentProps<'input'>

export function DefaultInput({ id, labelText, type, ...rest}: DefaultInputProps) { //rest - qualquer coisa que for informado lá, ele pega, como titulo
    return (
        <>
            {labelText && <label htmlFor={id}> {labelText} </label>}
            <input id={id} type={type} {...rest} className={styles.input}/>
        </>
    )
}