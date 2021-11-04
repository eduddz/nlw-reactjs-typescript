import { useContext } from 'react';
import { AuthContext } from '../../context/auth';
import styles from './styles.module.scss';
import { VscGithubInverted } from 'react-icons/vsc';

export function LoginBox() {
    const { signInUrl, user } = useContext(AuthContext)
    
    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com Github
            </a>
        </div>
    )
}