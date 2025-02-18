import { Text, View, Image, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export default function EventPage() {
    const { id } = useLocalSearchParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [isParticipating, setIsParticipating] = useState(false);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const docRef = doc(db, 'events', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setEvent(docSnap.data());
                } else {
                    setError('Evento não encontrado');
                }
            } catch (err) {
                setError('Erro ao buscar evento');
                console.error(err);
            }
        };

        const checkUserWaitingList = async () => {
            try {
                const waitingListRef = doc(db, 'waiting_line', id);

                const docSnap = await getDoc(waitingListRef);
                if (docSnap.exists()) {
                    const waitingList = docSnap.data();
                    if (waitingList.user_id && waitingList.user_id.includes(auth.currentUser.uid)) {
                        setIsParticipating(true);
                    }
                }
            } catch (err) {
                console.error('Erro ao verificar fila de espera', err);
            }
        };

        if (id) {
            fetchEvent();
            checkUserWaitingList();
        }
    }, [id]);

    const joinWaitingList = async () => {
        try {
            const userId = auth.currentUser.uid;
            const waitingListRef = doc(db, 'waiting_line', id);

            const docSnap = await getDoc(waitingListRef);
            if (docSnap.exists()) {
                const waitingList = docSnap.data();
                if (!waitingList.user_id) {
                    await updateDoc(waitingListRef, {
                        user_id: [userId],
                    });
                } else if (!waitingList.user_id.includes(userId)) {
                    await updateDoc(waitingListRef, {
                        user_id: [...waitingList.user_id, userId],
                    });
                }
            } else {
                await setDoc(waitingListRef, {
                    user_id: [userId],
                });
            }

            console.log('Usuário adicionado à fila de espera com sucesso');
            setIsParticipating(true);
        } catch (err) {
            setError('Erro ao adicionar à fila de espera');
            console.error(err);
        }
    };

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!event) {
        return <Text>Carregando evento...</Text>;
    }

    return (
        <SafeAreaView className="flex-1 gap-3 bg-white p-3">
            <Stack.Screen
                options={{
                    title: 'Evento',
                    headerTintColor: 'black',
                }}
            />
            <Image source={{ uri: event.image_uri }} className="aspect-video w-full rounded-xl" />
            <Text className="text-3xl font-bold" numberOfLines={2}>{event.title}</Text>
            <Text className="text-lg font-semibold uppercase text-amber-800">
                {dayjs(event.datetime).format('ddd, D MMM')} • {dayjs(event.datetime).format('h:mm A')}
            </Text>
            <Text className="text-lg" numberOfLines={2}>{event.description}</Text>

            <View className="absolute bottom-0 left-0 right-0 flex-row justify-between border-t-2 border-gray-300 p-5 pb-10">
                <Text className="text-xl font-semiBold">Doar</Text>
                <Pressable
                    onPress={isParticipating ? null : joinWaitingList}
                    className="rounded-md bg-pink-500 p-5 px-8"
                >
                    <Text className="text-lg font-bold text-white">
                        {isParticipating ? 'Na fila de espera' : 'Inscrever-se'}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
