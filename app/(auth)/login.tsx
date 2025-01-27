import React, { useState } from 'react'; 
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Pressable , Image} from 'react-native';
import { auth } from '~/utils/firebase'; // Certifique-se de que está importando o auth corretamente do firebase
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';  // Importe o tipo de erro do Firebase
import { useRouter, Stack } from 'expo-router';  // Importe o hook useRouter para navegação

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // Hook de navegação

    // Função para login do usuário
    async function handleLogin() {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Aqui você pode redirecionar o usuário para outra tela após o login
            // alert('Login successful')
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log('Erro no login:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    // Função para criar usuário
    async function handleCreateUser() {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    // Função para redirecionar para a tela de login/cadastro da ONG
    function handleONGLogin() {
        router.push('/loginOng'); // Redireciona para o arquivo loginOng.tsx
    }

    return (
        <View className="flex-1 bg-white gap-3 p-5">
            
            <Stack.Screen options={{title:"Pagina Inicial"}} />

            {/* <Image style={{width: 200, height:200}} source={require('~/assets/girlHeart.png')} /> */}
            
            <TextInput 
                className="rounded-md border border-gray-200 p-3"
                placeholder="Digite seu Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput 
                className="rounded-md border border-gray-200 p-3"
                placeholder="Digite sua Senha"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />

            <View className="flex-row gap-3">
                <Pressable onPress={handleLogin} className="flex-1 rounded-md border-2 p-3 px-8 items-center">
                    <Text className="text-red-500 text-pink-500 text-lg font-bold">Entrar</Text>
                </Pressable>

                <Pressable onPress={handleCreateUser} className="flex-1 rounded-md bg-pink-500 p-3 px-8 items-center">
                    <Text className="text-lg font-bold text-white">Cadastrar</Text>
                </Pressable>
            </View>

            {/* Novo botão de Login/Cadastro para ONG */}
            <Pressable onPress={handleONGLogin} className="mt-4 rounded-md bg-blue-500 p-3 px-8 items-center">
                <Text className="text-lg font-bold text-white">Login/Cadastro para ONGs</Text>
            </Pressable>
        </View>
    );
}
