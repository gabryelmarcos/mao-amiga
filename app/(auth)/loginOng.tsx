import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { auth, db } from '~/utils/firebase'; // Adicione a importação do db para acessar o Firestore
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; // Adicione a importação para interagir com o Firestore
import { FirebaseError } from 'firebase/app';  // Importe o tipo de erro do Firebase
import { Stack } from 'expo-router';

export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Função para login de usuário existente
    async function handleLogin() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Obtém o objeto user do retorno

            // Aqui, você pode salvar o 'typeUser' como 'ong' para o usuário logado no Firestore
            await setDoc(doc(db, "users", user.uid), {
                typeUser: 'ong',  // 'typeUser' com o valor 'ong'
                email: user.email,
                // Adicione outros campos conforme necessário
            });

            // Aqui você pode redirecionar o usuário para outra tela após o login

        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log('Erro no login:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    // Função para criar um novo usuário
    async function handleCreateUser() {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Obtém o objeto user do retorno

            // Após criar o usuário, adicione o 'typeUser' como 'ong' no Firestore
            await setDoc(doc(db, "users", user.uid), {
                typeUser: 'ong',  // 'typeUser' com o valor 'ong'
                
                // Adicione outros campos conforme necessário
            });

            // Aqui você pode redirecionar o usuário para outra tela após o cadastro

        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log('Erro na criação do usuário:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    return (
        <View className='flex-1 bg-white gap-3 p-5'>
            <Stack.Screen options={{title: "Página ONG"}} />
            
            <Text>CRIANDO CONTA ONG</Text>

            <TextInput 
                className='rounded-md border border-gray-200 p-3 '
                placeholder="Digite seu Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput 
                className='rounded-md border border-gray-200 p-3 '
                placeholder="Digite sua Senha"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />

            <View className='flex-row gap-3'>
                <Pressable onPress={handleLogin} className='flex-1 rounded-md border-2 p-3 px-8 items-center'>
                    <Text className='text-red-500 text-pink-500 text-lg font-bold '>Entrar</Text>
                </Pressable>

                <Pressable onPress={handleCreateUser} className='flex-1 rounded-md bg-pink-500 p-3 px-8 items-center'>
                    <Text className='text-lg font-bold text-white'>Cadastrar</Text>
                </Pressable>
            </View>
        </View>
    );
}
