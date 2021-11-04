import styles from './styles.module.scss';
import { api } from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
        idade: number;
    }
}

//fila de mensagens
const messagesQueue: Message[] = []

const socket = io('http://localhost:4000')
socket.on('new_message', (newMessage: Message) => {
    messagesQueue.push(newMessage);
})

export function MessageList() {
    //<Message[]> lista de mensagens tipadas
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean))
                //Boolean remove caso não haja 3 mensagens sendo enviadas
                messagesQueue.shift();
                }
        }, 2000)
    }, [])

    //quando eu quero fazer uma requisição do back assim que meu componente é exibido em tela
    //useEffect recebe 2 parâmetros
    // 1º qual função eu quero executar
    // 2º quando eu quero executar. É em forma de array, porque array? porque dentro do array ficará uma variável e toda vez que a mesma mudar, a função é chamada novamente
    useEffect(
        () => {
            api.get<Message[]>('messages/last3').then(response => {
                setMessages(response.data)
            })
        }, []
    )

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="Do While 20210" />

            <ul className={styles.messageList}> 
                {/*toda vez que uso map, sou obrigado a passar o key na primeira tag dentro do mesmo*/}
                {
                    messages.map(message => {
                        return (
                            <li key={message.id} className={styles.message}>
                                <p className={styles.messageContent}>
                                    {message.text}
                                </p>
                                <div className={styles.messageUser}>
                                    <div className={styles.userImage}>
                                        <img src={message.user.avatar_url} alt="Eduardo Esteves" />
                                    </div>
                                    <span>{message.user.name}</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}