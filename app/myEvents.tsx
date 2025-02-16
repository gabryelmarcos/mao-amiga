import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function MyEvents() {
  const [events, setEvents] = useState([]); // Mantém o estado dos eventos
  const db = getFirestore();  // Inicializa o Firestore
  const auth = getAuth();  // Instância de autenticação do Firebase

  // Função para buscar eventos do Firestore em tempo real
  const fetchEvents = () => {
    const userId = auth.currentUser.uid;  // Obtém o ID do usuário logado
    const attendancesRef = doc(db, 'attendances', userId);  // Referência para o documento de participações do usuário

    onSnapshot(attendancesRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userAttendance = docSnap.data();
        const acceptedEvents = userAttendance.accepted || [];  // Pega os eventos aceitos (pode ser um array vazio)

        // Agora, busca todos os eventos e escuta as mudanças
        const eventsRef = collection(db, 'events');
        const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
          const eventsData = querySnapshot.docs
            .map(doc => {
              const eventData = doc.data();
              return { id: doc.id, ...eventData };
            })
            .filter(event => acceptedEvents.includes(event.id));  // Filtra os eventos aceitos pelo usuário

          setEvents(eventsData);  // Atualiza o estado com os eventos filtrados
        });

        // Cleanup da função de escuta quando o componente for desmontado
        return () => unsubscribe();
      } else {
        console.log("Usuário não tem participação registrada.");
      }
    });
  };

  // Função para excluir a participação de um evento
  const handleUnregisterEvent = async (eventId) => {
    try {
      const userId = auth.currentUser.uid;  // Obtém o ID do usuário logado
      const attendancesRef = doc(db, 'attendances', userId);  // Referência para o documento de participações do usuário

      // Atualiza a lista de eventos aceitos, removendo o evento específico
      await updateDoc(attendancesRef, {
        accepted: arrayRemove(eventId),
      });

      // Atualiza o estado localmente removendo o evento excluído
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Erro ao excluir participação: ", error);
    }
  };

  // Função para confirmar a exclusão da participação
  const confirmUnregisterEvent = (eventId) => {
    Alert.alert(
      "Confirmar Cancelamento",  // Título do alerta
      "Você tem certeza que deseja cancelar sua participação neste evento?",  // Mensagem do alerta
      [
        {
          text: "Cancelar",  // Botão de cancelamento
          style: "cancel"
        },
        {
          text: "Sim",  // Botão de confirmação
          onPress: () => handleUnregisterEvent(eventId)  // Chama a função de exclusão
        }
      ]
    );
  };

  // Chama a função fetchEvents assim que o componente for montado
  useEffect(() => {
    fetchEvents();
  }, []);  // O array vazio significa que o useEffect será chamado apenas uma vez

  return (
    <View>
      <Stack.Screen options={{ title: 'Participações' }} />

      {events && events.length > 0 ? (
        <FlatList
          className="bg-white"
          style={{ backgroundColor: 'white' }}
          data={events} // Dados de eventos filtrados
          renderItem={({ item }) => (
            <View>
              <EventListItem event={item} />
              {/* Botão para excluir a participação no evento */}
              <Pressable
                className="mb-2 rounded-md bg-gray-100 p-3"
                onPress={() => confirmUnregisterEvent(item.id)} // Chama a função de confirmação
              >
                <Text className="text-center font-semibold text-red-500">
                  Cancelar Participação
                </Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item.id} // Extrai uma chave única para cada item
        />
      ) : (
        <View>
          <Text className='text-lg text-center my-20'>Sem participações</Text>
        </View>
      )}
    </View>
  );
};
