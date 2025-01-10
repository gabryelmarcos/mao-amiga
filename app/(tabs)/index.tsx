import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 

import events from '~/assets/events.json'



export default function Events() {

  const db = getFirestore();  // Inicializa o Firestore

  const fethEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');  // Referência para a coleção 'events'
      const querySnapshot = await getDocs(eventsRef);  // Obtém os documentos da coleção
      const events = querySnapshot.docs.map(doc => {
        const eventData = doc.data();
        console.log('Evento:', eventData);  // Logando cada evento individualmente
        return eventData;
      });
      console.log('Todos os eventos:', events);  // Logando todos os eventos
    } catch (error) {
      console.error("Erro ao buscar eventos: ", error);
    }
  };
  
  useEffect(() => {

    console.log('useEffect foi chamado');

    fethEvents();
  }, []);

  return (
    <>
      {/* titulo da pagina */}
      <Stack.Screen options={{ title: 'Events' }} /> 


      {/* Event List item */}


      <FlatList
        className='bg-white'
        style={{backgroundColor: 'white'}}
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
      />

      

      {/* <EventListItem event={events[0]} /> */}
    </>
  );
}


