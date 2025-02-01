import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Pressable, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { auth } from '~/utils/firebase'; // Certifique-se de que está importando o auth corretamente do firebase 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';  // Importe o tipo de erro do Firebase 
import { useRouter, Stack } from 'expo-router';  // Importe o hook useRouter para navegação
import { StatusBar } from 'expo-status-bar';

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

    return (
        
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Stack.Screen options={{ title: "Pagina Inicial", headerShown: false }} />

                    <Image
                        className='h-full w-full absolute'
                        source={require('~/assets/background.png')}
                    />

                    <View className='flex-row justify-around w-full absolute'>
                        <Image
                            className='h-[225] w-[90]'
                            source={require('~/assets/light.png')}
                        />

                        <Image
                            className='h-[160] w-[65]'
                            source={require('~/assets/light.png')}
                        />
                    </View>

                    <View className='h-full w-full flex justify-around pt-40 pb-10'>

                        <View className='flex items-center'>
                            <Text className='text-white font-bold tracking-wider text-5xl'>
                                Acesso
                            </Text>
                        </View>

                        <View className='flex items-center mx-4 space-y-4 gap-3'>
                        
                            <View className='bg-black/5 p-5 rounded-2xl w-full '>
                                <TextInput 
                                    placeholder="Digite seu Email"
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                />
                            </View>

                            <View className='bg-black/5  p-5 rounded-2xl w-full mb-6'>
                                <TextInput 
                                    placeholder="Digite sua Senha"
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    secureTextEntry={true}
                                />
                            </View>

                            <View className="flex-row gap-3">
                                <Pressable onPress={handleLogin} className="flex-1 rounded-md border-2 p-3 px-8 items-center">
                                    <Text className="text-red-500 text-pink-500 text-lg font-bold">Entrar</Text>
                                </Pressable>

                                <Pressable onPress={handleCreateUser} className="flex-1 rounded-md bg-pink-500 p-3 px-8 items-center">
                                    <Text className="text-lg font-bold text-white">Cadastrar</Text>
                                </Pressable>
                            </View>
                        
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
