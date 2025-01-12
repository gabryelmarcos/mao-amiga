import { View, Text, TextInput, Pressable } from 'react-native';
import { Stack } from 'expo-router'
import { useState } from 'react';

export default function NewEvent() {

    const [loading, isLoadding] = useState(false)
    const [title, setTitle] = useState("")

    const createEvent = async () => {

    }

    return (
        <View className='flex-1 gap-3 bg-white p-5'>
            <Stack.Screen options={{ title: "Novo Evento" }} />

            <TextInput
                placeholder='Titulo'
                value={title}
                onChangeText={setTitle}
                className="rounded-md border border-gray-200 p-3"
            />

            <TextInput
                placeholder='Descrição'
                multiline
                numberOfLines={3}
                className="min-h-32 rounded-md border border-gray-200 p-3"
            />

            <Pressable  className="mt-auto mb-9 items-center rounded-md bg-red-500 p-3 px-8">
                <Text className="text-lg font-bold text-white">Criar Novo Evento</Text>
            </Pressable>
        </View>
    )
}