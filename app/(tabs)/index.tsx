import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {FlatList } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function Events() {
  const [events, setEvents] = useState([]); // Mantém o estado dos eventos
  const db = getFirestore();  // Inicializa o Firestore

  // Função para buscar eventos do Firestore
  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');  // Referência para a coleção 'events'
      const querySnapshot = await getDocs(eventsRef);  // Obtém os documentos da coleção
      const eventsData = querySnapshot.docs.map(doc => {
        const eventData = doc.data(); // Obtém os dados do evento
        return { id: doc.id, ...eventData }; // Adiciona um id único para cada evento
      });

      // console.log('Todos os eventos:', eventsData); // Logando todos os eventos
      setEvents(eventsData); // Atualiza o estado com os dados dos eventos
    } catch (error) {
      console.error("Erro ao buscar eventos: ", error);
    }
  };

  // Chama a função fetchEvents assim que o componente for montado
  useEffect(() => {
    fetchEvents();
  }, []);  // O array vazio significa que o useEffect será chamado apenas uma vez

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
