import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

export default function Events() {
  const [events, setEvents] = useState([]);
  const db = getFirestore();

  const listenToEvents = () => {
    const eventsRef = collection(db, 'events');
    
    const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => {
        const eventData = doc.data();
        return { id: doc.id, ...eventData };
      });

      setEvents(eventsData);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = listenToEvents();
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Eventos' }} />
      <FlatList
        className='bg-white'
        style={{ backgroundColor: 'white' }}
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}
