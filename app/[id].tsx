import { Text, View, Image, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Inicializando o Firestore
const db = getFirestore();
const auth = getAuth();  // Obter a instância de autenticação

export default function EventPage() {
    const { id } = useLocalSearchParams();
    const [event, setEvent] = useState(null);  // Estado para armazenar os dados do evento
    const [error, setError] = useState(null);  // Estado para erro caso o evento não seja encontrado
    const [isParticipating, setIsParticipating] = useState(false); // Estado para verificar se o usuário já está na fila de espera

    useEffect(() => {
        // Função para buscar evento do Firestore
        const fetchEvent = async () => {
            try {
                const docRef = doc(db, 'events', id);  // Referência para o documento com o id fornecido
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setEvent(docSnap.data());  // Armazena os dados do evento no estado
                } else {
                    setError('Evento não encontrado');
                }
            } catch (err) {
                setError('Erro ao buscar evento');
                console.error(err);
            }
        };

        // Função para verificar se o usuário já está na fila de espera
        const checkUserWaitingList = async () => {
            try {
                const waitingListRef = doc(db, 'waiting_line', id);  // Referência à fila de espera do evento

                const docSnap = await getDoc(waitingListRef);
                if (docSnap.exists()) {
                    const waitingList = docSnap.data();
                    if (waitingList.user_id && waitingList.user_id.includes(auth.currentUser.uid)) {
                        setIsParticipating(true);  // Usuário já está na fila de espera
                    }
                }
            } catch (err) {
                console.error('Erro ao verificar fila de espera', err);
            }
        };

        if (id) {
            fetchEvent();  // Chama a função para buscar o evento
            checkUserWaitingList();  // Verifica se o usuário já está na fila de espera
        }
    }, [id]);

    // Função para o usuário se inscrever na fila de espera
    const joinWaitingList = async () => {
        try {
            const userId = auth.currentUser.uid;
            const waitingListRef = doc(db, 'waiting_line', id);  // Referência à fila de espera do evento

            // Verificar se a fila de espera já existe
            const docSnap = await getDoc(waitingListRef);
            if (docSnap.exists()) {
                // Documento existe, atualizamos o array de user_id
                const waitingList = docSnap.data();
                if (!waitingList.user_id) {
                    // Se o campo "user_id" não existir, criamos ele como um array
                    await updateDoc(waitingListRef, {
                        user_id: [userId],  // Inicializa com o ID do usuário
                    });
                } else if (!waitingList.user_id.includes(userId)) {
                    // Se o usuário ainda não estiver na fila, adicionamos o ID
                    await updateDoc(waitingListRef, {
                        user_id: [...waitingList.user_id, userId],  // Adiciona o ID do usuário
                    });
                }
            } else {
                // Documento não existe, cria a fila de espera com o ID do usuário
                await setDoc(waitingListRef, {
                    user_id: [userId],  // Cria a fila com o ID do usuário
                });
            }

            console.log('Usuário adicionado à fila de espera com sucesso');
            setIsParticipating(true); // Atualiza o estado para indicar que o usuário está na fila de espera
        } catch (err) {
            setError('Erro ao adicionar à fila de espera');
            console.error(err);
        }
    };

    if (error) {
        return <Text>{error}</Text>;
    }

    if (!event) {
        return <Text>Carregando evento...</Text>;  // Exibe uma mensagem de carregamento
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

            {/* Footer */}
            <View className="absolute bottom-0 left-0 right-0 flex-row justify-between border-t-2 border-gray-300 p-5 pb-10">
                <Text className="text-xl font-semiBold">Inscrever-se</Text>
                <Pressable
                    onPress={isParticipating ? null : joinWaitingList} // Impede a inscrição se já estiver na fila de espera
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
