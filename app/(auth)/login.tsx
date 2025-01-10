import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity,Pressable } from 'react-native';
import { auth } from '~/utils/firebase'; // Certifique-se de que está importando o auth corretamente do firebase
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';  // Importe o tipo de erro do Firebase
import { Stack } from 'expo-router';


export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    async function handleCreateUser() {
            await createUserWithEmailAndPassword(auth,email,password)
        }

    return (
        <View className='flex-1 bg-white  gap-3  p-5'>

            <Stack.Screen options={{title:"Login"}} />
            
            {/* <Text>Email: </Text> */}

            <TextInput 
                className='rounded-md border border-gray-200 p-3 '
                placeholder="Digite seu Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            {/* <Text>Senha:</Text> */}

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

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: 50,
//         backgroundColor: 'yellowgreen',
//     },

//     input: {
//         marginLeft: 8,
//         marginRight: 8,
//         borderWidth: 1,
//         marginBottom: 14,
//         padding: 10,
//     },

//     button: {
//         backgroundColor: "#000",
//         marginRight: 8,
//         marginLeft: 8,
//         padding: 10,
//         borderRadius: 5,
//     },

//     buttonText: {
//         color: '#FFFFFF',
//         textAlign: 'center',
//     },

//     linkButton: {
//         marginTop: 10,
//         alignItems: 'center',
//     },

//     linkText: {
//         color: '#0000FF',
//     },
// });
