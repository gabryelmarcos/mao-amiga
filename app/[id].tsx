import { Text, View, Image, Pressable } from 'react-native';
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
    const [isParticipating, setIsParticipating] = useState(false); // Estado para verificar se o usuário está participando

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

        // Função para verificar se o usuário já está participando do evento
        const checkUserParticipation = async () => {
            try {
                const userId = auth.currentUser.uid;
                const attendanceRef = doc(db, 'attendances', userId);  // Usando o ID do usuário como documento
                const docSnap = await getDoc(attendanceRef);

                if (docSnap.exists()) {
                    const userAttendance = docSnap.data();
                    if (userAttendance.accepted && userAttendance.accepted.includes(id)) {
                        setIsParticipating(true);  // Usuário já está participando do evento
                    }
                }
            } catch (err) {
                console.error('Erro ao verificar participação', err);
            }
        };

        if (id) {
            fetchEvent();  // Chama a função para buscar o evento
            checkUserParticipation(); // Verifica se o usuário está participando
        }
    }, [id]);

    // Função para o usuário participar do evento
    const joinEvent = async () => {
        try {
            const userId = auth.currentUser.uid;
            const attendanceRef = doc(db, 'attendances', userId);  // Documento de "attendance" do usuário

            // Verificar se o usuário já possui o campo "accepted" e o evento atual
            const docSnap = await getDoc(attendanceRef);
            if (docSnap.exists()) {
                // Documento existe, atualizamos o campo "accepted" com o novo evento
                const userAttendance = docSnap.data();
                if (!userAttendance.accepted) {
                    // Se o campo "accepted" não existir, criamos ele como um array
                    await updateDoc(attendanceRef, {
                        accepted: [id],  // Inicializa com o evento atual
                    });
                } else if (!userAttendance.accepted.includes(id)) {
                    // Se o evento ainda não está na lista de eventos aceitos
                    await updateDoc(attendanceRef, {
                        accepted: [...userAttendance.accepted, id],  // Adiciona o novo evento
                    });
                }
            } else {
                // Documento não existe, cria o novo documento com o evento
                await setDoc(attendanceRef, {
                    accepted: [id],  // Cria com o evento atual
                });
            }

            console.log('Participação registrada com sucesso');
            setIsParticipating(true); // Atualiza o estado para indicar que o usuário está participando
        } catch (err) {
            setError('Erro ao registrar participação');
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
        <View className="flex-1 gap-3 bg-white p-3">
            <Stack.Screen
                options={{
                    title: 'Event',
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
                <Text className="text-xl font-semiBold">Doar</Text>
                <Pressable
                    onPress={isParticipating ? null : joinEvent} // Impede a inscrição se já estiver participando
                    className="rounded-md bg-pink-500 p-5 px-8"
                >
                    <Text className="text-lg font-bold text-white">
                        {isParticipating ? 'Solicitado' : 'Participar'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
