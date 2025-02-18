import { Text, View, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

const db = getFirestore();
const auth = getAuth();

export default function WaitingScreen() {
    const [userEvents, setUserEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const ownEvents = userData.own_event || [];

                    const usersInQueue = await Promise.all(ownEvents.map(async (eventId) => {
                        const waitingListRef = doc(db, 'waiting_line', eventId);
                        
                        onSnapshot(waitingListRef, async (snapshot) => {
                            if (snapshot.exists()) {
                                const waitingList = snapshot.data();
                                const userIds = waitingList.user_id || [];
                                const eventTitle = waitingList.event_title || 'Evento sem nome';

                                const usersData = await Promise.all(userIds.map(async (userId) => {
                                    const userRef = doc(db, 'users', userId);
                                    const userSnap = await getDoc(userRef);
                                    if (userSnap.exists()) {
                                        return { name: userSnap.data().full_name, eventTitle, userId, eventId };
                                    }
                                    return null;
                                }));

                                setUserEvents(prevEvents => {
                                    const existingEvents = prevEvents.filter(event => event.eventId !== eventId);
                                    const newUsers = usersData.filter(user => user != null);
                                    return [...existingEvents, ...newUsers];
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
                setLoading(false);
            }
        };

        fetchUserEvents();
    }, []);

    if (loading) {
        return <Text>Carregando...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

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

    const handleConfirm = async (userId, eventId) => {
        try {
            const attendanceRef = doc(db, 'attendances', userId);
            const attendanceSnap = await getDoc(attendanceRef);

            if (attendanceSnap.exists()) {
                const attendanceData = attendanceSnap.data();
                const acceptedEvents = attendanceData.accepted || [];

                await updateDoc(attendanceRef, {
                    accepted: arrayUnion(eventId),
                });

                console.log(`Evento ${eventId} adicionado à lista de aceitação do usuário ${userId}`);
            } else {
                console.error('Usuário não encontrado na coleção de presenças');
            }

            const waitingListRef = doc(db, 'waiting_line', eventId);
            const waitingListSnap = await getDoc(waitingListRef);

            if (waitingListSnap.exists()) {
                const waitingList = waitingListSnap.data();
                const userIds = waitingList.user_id || [];

                const updatedUserIds = userIds.filter(id => id !== userId);

                await updateDoc(waitingListRef, {
                    user_id: updatedUserIds,
                });

                console.log(`Usuário ${userId} removido da fila de espera para o evento ${eventId}`);

                setUserEvents(prevEvents => prevEvents.filter(item => item.userId !== userId || item.eventId !== eventId));
            } else {
                console.error('Evento não encontrado na fila de espera');
            }

        } catch (err) {
            console.error('Erro ao confirmar o usuário ou atualizar a fila de espera:', err);
        }
    };

    const handleDelete = async (userId, eventId) => {
        try {
            const waitingListRef = doc(db, 'waiting_line', eventId);
            const waitingListSnap = await getDoc(waitingListRef);

            if (waitingListSnap.exists()) {
                const waitingList = waitingListSnap.data();
                const userIds = waitingList.user_id || [];

                const updatedUserIds = userIds.filter(id => id !== userId);

                await updateDoc(waitingListRef, {
                    user_id: updatedUserIds,
                });

                console.log(`Usuário ${userId} removido da fila de espera para o evento ${eventId}`);

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
