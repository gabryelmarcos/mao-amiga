import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { auth } from '~/utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleCreateUser() {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/login');
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log('Erro no cadastro:', error.message);
            } else {
                console.log('Erro desconhecido:', error);
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                    <Stack.Screen options={{ headerShown: false }} />
                    <StatusBar style="dark" />

                    {/* Container Principal */}
                    <View className="flex-1 justify-center p-8">
                        
                        {/* Cabeçalho */}
                        <View className="items-center mb-16">
                            <View className="bg-pink-100 w-20 h-20 rounded-2xl items-center justify-center mb-6">
                                <MaterialCommunityIcons 
                                    name="account-plus-outline" 
                                    size={40} 
                                    color="#db2777" 
                                />
                            </View>
                            <Text className="text-3xl font-bold text-gray-900 mb-2">
                                Criar Nova Conta
                            </Text>
                            <Text className="text-gray-500">Cadastre-se para começar</Text>
                        </View>

                        {/* Formulário */}
                        <View className="space-y-6">
                            {/* Campo Email */}
                            <View className="space-y-2">
                                <Text className="text-sm text-gray-600">Email</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                                    <MaterialCommunityIcons 
                                        name="email-outline" 
                                        size={20} 
                                        color="#6b7280" 
                                        className="mr-3" 
                                    />
                                    <TextInput
                                        className="flex-1 text-gray-900"
                                        placeholder="seu@email.com"
                                        placeholderTextColor="#9ca3af"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Campo Senha */}
                            <View className="space-y-2">
                                <Text className="text-sm text-gray-600">Senha</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                                    <MaterialCommunityIcons 
                                        name="lock-outline" 
                                        size={20} 
                                        color="#6b7280" 
                                        className="mr-3" 
                                    />
                                    <TextInput
                                        className="flex-1 text-gray-900"
                                        placeholder="••••••••"
                                        placeholderTextColor="#9ca3af"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            {/* Botão de Cadastro */}
                            <Pressable
                                onPress={handleCreateUser}
                                className="bg-pink-600 rounded-lg p-4 shadow-sm active:bg-pink-700"
                            >
                                <Text className="text-white text-center font-medium">Cadastrar</Text>
                            </Pressable>

                            {/* Link para Login */}
                            <View className="flex-row justify-center pt-4">
                                <Pressable 
                                    onPress={() => router.push('/login')}
                                    className="flex-row space-x-2"
                                >
                                    <Text className="text-gray-600">Já tem uma conta?</Text>
                                    <Text className="text-pink-600 font-semibold">Fazer login</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}