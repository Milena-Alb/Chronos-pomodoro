import styles from './styles.module.css';

type HeadingProps = {
    children: React.ReactNode;
};

export function Heading({ children }: HeadingProps) { //children desetruturação do props, agora posso acessar diretamente
    return (
        <>
            <h1 className={styles.heading}>{children}</h1>
           
        </>


    );
}