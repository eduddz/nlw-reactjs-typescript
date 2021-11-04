import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../services/api';

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string
        name: string;
        login: string;
    }
}

export function AuthProvider(props: AuthProvider) {
        const[user, setUser] = useState<User | null>(null)

        //scope quais informações quero do usuario, com user quero nome, email, avatar
        const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=012815c507b47f54fc7c`;

        async function signIn(githubCode: string) {
            const response = await api.post<AuthResponse>('authenticate', {
                code: githubCode
            })
    
            const { token, user } = response.data
    
            localStorage.setItem('@dowhile:token', token)

            api.defaults.headers.common.authorization = `Bearer ${token}`
    
            setUser(user);
        }

        function signOut() {
            setUser(null)
            localStorage.removeItem('@dowhile:token')
        }

        useEffect(
            () => {
                const token = localStorage.getItem('@dowhile:token')

                if (token) {
                    api.defaults.headers.common.authorization = `Bearer ${token}`
                    api.get<User>('profile').then(response => {
                        setUser(response.data)
                    })
                }
            }, []
        )
    
        useEffect(
            () => {
                //recebendo a url
                const url = window.location.href;
                //verificando se inclui o code do github
                const hasGithubCode = url.includes('?code=')
    
                if (hasGithubCode) {
                    //o que vier na urlWithoutCode é a url
                    //o que vier depois, no githubCode é o código
                    const [urlWithoutCode, githubCode] = url.split('?code=')
    
                    //limpando a url do code
                    window.history.pushState({}, '', urlWithoutCode);
    
                    signIn(githubCode);
                }
            }, []
        )

    return(
        /** todos os que estão dentro do Provider, terão acesso a informação*/
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}