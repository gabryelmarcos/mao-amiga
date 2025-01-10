import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {db,auth} from '~/utils/firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'

export default function RegisterScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    async function handleCreateUser() {
        await createUserWithEmailAndPassword(auth,email,password)
    }

    return (
        <View style={styles.container}>

            <Text> Email: </Text>

            <TextInput 
            style={styles.input}
            placeholder='Digite seu Email'
            value={email}
            onChangeText={(text) => setEmail(text)}
            />

            <Text>Senha:</Text>

            <TextInput 
            style={styles.input}
            placeholder='Digite sua Senha'
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            />  

        <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
            <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: 'yellowgreen'
    },

    input: {
        marginLeft: 8,
        marginRight: 8,
        borderWidth: 1,
        marginBottom: 14,
    },

    button: {
        backgroundColor: "000",
        marginRight: 8,
        marginLeft: 8,
        padding: 10,
        borderRadius: 5,
    },

    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
})
