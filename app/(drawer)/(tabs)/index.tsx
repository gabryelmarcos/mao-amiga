import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

export default function Events() {
  const [events, setEvents] = useState([]); // Mantém o estado dos eventos
  const db = getFirestore();  // Inicializa o Firestore

  // Função para escutar as mudanças na coleção de eventos
  const listenToEvents = () => {
    const eventsRef = collection(db, 'events');  // Referência para a coleção 'events'
    
    // O onSnapshot escuta as alterações em tempo real na coleção
    const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => {
        const eventData = doc.data(); // Obtém os dados do evento
        return { id: doc.id, ...eventData }; // Adiciona um id único para cada evento
      });

      setEvents(eventsData); // Atualiza o estado com os dados dos eventos
    });

    // Retorna a função de cancelamento do listener quando o componente for desmontado
    return unsubscribe;
  };

  // Chama a função listenToEvents assim que o componente for montado
  useEffect(() => {
    const unsubscribe = listenToEvents();

    // Limpeza do listener ao desmontar o componente
    return () => unsubscribe();
  }, []);  // O array vazio garante que isso aconteça apenas na montagem e desmontagem

  return (
    <>
      {/* título da página */}
      <Stack.Screen options={{ title: 'Eventos' }} />

      {/* FlatList para exibir os eventos */}
      <FlatList
        className='bg-white'
        style={{ backgroundColor: 'white' }}
        data={events} // Dados de eventos
        renderItem={({ item }) => <EventListItem event={item} />} // Renderiza cada item
        keyExtractor={(item) => item.id} // Extrai uma chave única para cada item
      />
    </>
  );
}
