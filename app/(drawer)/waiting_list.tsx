import { Text, View, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

const db = getFirestore();
const auth = getAuth();

export default function WaitingScreen() {
    const [userEvents, setUserEvents] = useState([]);  // Estado para armazenar nomes dos usuários e nomes dos eventos
    const [error, setError] = useState(null);  // Estado para erros
    const [loading, setLoading] = useState(true);  // Estado de carregamento

    useEffect(() => {
        // Função para buscar os eventos que o usuário é responsável
        const fetchUserEvents = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userRef = doc(db, 'users', userId);  // Referência ao documento do usuário
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const ownEvents = userData.own_event || [];  // Pega os eventos que o usuário é responsável

                    // Para cada evento em own_event, buscamos a fila de espera
                    const usersInQueue = await Promise.all(ownEvents.map(async (eventId) => {
                        const waitingListRef = doc(db, 'waiting_line', eventId);  // Referência à fila de espera do evento
                        
                        // Aqui, adicionamos um listener para mudanças em tempo real
                        onSnapshot(waitingListRef, async (snapshot) => {
                            if (snapshot.exists()) {
                                const waitingList = snapshot.data();
                                const userIds = waitingList.user_id || [];  // IDs dos usuários na fila de espera
                                const eventTitle = waitingList.event_title || 'Evento sem nome';  // Nome do evento

                                // Para cada usuário na fila, buscamos o nome
                                const usersData = await Promise.all(userIds.map(async (userId) => {
                                    const userRef = doc(db, 'users', userId);  // Referência ao documento do usuário
                                    const userSnap = await getDoc(userRef);
                                    if (userSnap.exists()) {
                                        return { name: userSnap.data().full_name, eventTitle, userId, eventId };  // Retorna nome, título do evento, ID do usuário e eventId
                                    }
                                    return null;
                                }));

                                // Atualiza a lista de usuários da fila
                                setUserEvents(prevEvents => {
                                    // Filtra os eventos que já foram carregados
                                    const existingEvents = prevEvents.filter(event => event.eventId !== eventId);
                                    // Adiciona os novos usuários à lista existente
                                    const newUsers = usersData.filter(user => user != null);
                                    return [...existingEvents, ...newUsers];  // Retorna a lista atualizada de usuários
                                });
                            }
                        });
                    }));
                } else {
                    setError('Usuário não encontrado');
                }
            } catch (err) {
                setError('Erro ao buscar eventos');
                console.error(err);
            } finally {
                setLoading(false);  // Finaliza o carregamento
            }
        };

        fetchUserEvents();  // Chama a função para buscar os eventos do usuário
    }, []);

    if (loading) {
        return <Text>Carregando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    // Função de renderização para a FlatList
    const renderItem = ({ item }) => (
        <View className="bg-white p-4 rounded-2xl shadow-sm mb-3 mx-2 flex-row items-center">
            <View className="bg-purple-100 p-3 rounded-full mr-4">
                <MaterialIcons name="person" size={24} color="#6d28d9" />
            </View>
            
            <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {item.name}
                </Text>
                <View className="flex-row items-center">
                    <MaterialIcons name="event" size={16} color="#6b7280" />
                    <Text className="text-sm text-gray-600 ml-2" numberOfLines={1}>
                        {item.eventTitle}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center space-x-3">
                <TouchableOpacity onPress={() => handleConfirm(item.userId, item.eventId)}>
                    <MaterialIcons name="check-circle" size={24} color="#22c55e" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.userId, item.eventId)}>
                    <MaterialIcons name="delete" size={24} color="#dc2626" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Função para confirmar o usuário
    const handleConfirm = async (userId, eventId) => {
        try {
            // Passo 1: Adicionar o eventId no array 'accepted' na coleção 'attendances'
            const attendanceRef = doc(db, 'attendances', userId);  // Referência à coleção 'attendances' usando userId
            const attendanceSnap = await getDoc(attendanceRef);  // Obtém os dados do documento

            if (attendanceSnap.exists()) {
                const attendanceData = attendanceSnap.data();
                const acceptedEvents = attendanceData.accepted || [];  // Array de eventos aceitos

                // Atualiza o array 'accepted' com o novo eventId
                await updateDoc(attendanceRef, {
                    accepted: arrayUnion(eventId),  // Adiciona o eventId no array 'accepted'
                });

                console.log(`Evento ${eventId} adicionado à lista de aceitação do usuário ${userId}`);
            } else {
                console.error('Usuário não encontrado na coleção de presenças');
            }

            // Passo 2: Excluir o usuário da fila de espera
            const waitingListRef = doc(db, 'waiting_line', eventId);  // Referência à fila de espera do evento com eventId
            const waitingListSnap = await getDoc(waitingListRef);  // Obtém os dados da fila de espera

            if (waitingListSnap.exists()) {
                const waitingList = waitingListSnap.data();
                const userIds = waitingList.user_id || [];

                // Filtra o array de userIds, removendo o userId
                const updatedUserIds = userIds.filter(id => id !== userId);

                // Atualiza o documento da fila de espera
                await updateDoc(waitingListRef, {
                    user_id: updatedUserIds,  // Atualiza a lista de user_ids
                });

                console.log(`Usuário ${userId} removido da fila de espera para o evento ${eventId}`);

                // Atualiza o estado local para refletir a remoção
                setUserEvents(prevEvents => prevEvents.filter(item => item.userId !== userId || item.eventId !== eventId));
            } else {
                console.error('Evento não encontrado na fila de espera');
            }

        } catch (err) {
            console.error('Erro ao confirmar o usuário ou atualizar a fila de espera:', err);
        }
    };

    // Função para excluir o usuário da fila de espera
    const handleDelete = async (userId, eventId) => {
        try {
            const waitingListRef = doc(db, 'waiting_line', eventId);
            const waitingListSnap = await getDoc(waitingListRef);

            if (waitingListSnap.exists()) {
                const waitingList = waitingListSnap.data();
                const userIds = waitingList.user_id || [];

                // Filtra o usuário a ser removido
                const updatedUserIds = userIds.filter(id => id !== userId);

                await updateDoc(waitingListRef, {
                    user_id: updatedUserIds,
                });

                console.log(`Usuário ${userId} removido da fila de espera para o evento ${eventId}`);

                // Atualiza o estado para remover o item específico do evento
                setUserEvents(prevEvents => prevEvents.filter(item => item.userId !== userId || item.eventId !== eventId));
            } else {
                console.error('Evento não encontrado na fila de espera');
            }
        } catch (err) {
            console.error('Erro ao remover usuário da fila de espera:', err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-4 pt-6 pb-2">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Fila de Espera</Text>
                <Text className="text-sm text-gray-500">
                    Usuários aguardando aprovação para seus eventos
                </Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6d28d9" />
                    <Text className="text-gray-600 mt-4">Carregando participantes...</Text>
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-10">
                    <MaterialIcons name="error-outline" size={40} color="#dc2626" />
                    <Text className="text-center text-red-600 mt-4 text-lg">{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={userEvents}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    contentContainerClassName="p-2"
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center mt-20">
                            <MaterialIcons name="people-outline" size={50} color="#cbd5e1" />
                            <Text className="text-gray-400 text-lg mt-4">
                                Nenhum usuário na fila de espera
                            </Text>
                        </View>
                    }
                    ItemSeparatorComponent={() => <View className="h-2" />}
                />
            )}
        </SafeAreaView>
    );
}
