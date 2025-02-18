import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  const fetchEvents = async () => {
    try {
      const userId = auth.currentUser.uid;
      const attendancesRef = doc(db, 'attendances', userId);
      const docSnap = await getDoc(attendancesRef);

      if (docSnap.exists()) {
        const userAttendance = docSnap.data();
        const acceptedEvents = userAttendance.accepted || [];

        const eventsRef = collection(db, 'events');
        const querySnapshot = await getDocs(eventsRef);
        const eventsData = querySnapshot.docs
          .map(doc => {
            const eventData = doc.data();
            return { id: doc.id, ...eventData };
          })
          .filter(event => acceptedEvents.includes(event.id));

        setEvents(eventsData);
      } else {
        console.log("Usuário não tem participação registrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar eventos ou participações: ", error);
    }
  };

  const handleUnregisterEvent = async (eventId) => {
    try {
      const userId = auth.currentUser.uid;
      const attendancesRef = doc(db, 'attendances', userId);

      await updateDoc(attendancesRef, {
        accepted: arrayRemove(eventId),
      });

      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Erro ao excluir participação: ", error);
    }
  };

  const confirmUnregisterEvent = (eventId) => {
    Alert.alert(
      "Confirmar Cancelamento",
      "Você tem certeza que deseja cancelar sua participação neste evento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => handleUnregisterEvent(eventId)
        }
      ]
    );
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View>
      <Stack.Screen options={{ title: 'Participações' }} />

      <FlatList
        className='bg-white'
        style={{ backgroundColor: 'white' }}
        data={events}
        renderItem={({ item }) => (
          <View>
            <EventListItem event={item} />
            <Pressable
              className='bg-gray-100 p-3 rounded-md mb-2'
              onPress={() => confirmUnregisterEvent(item.id)}
            >
              <Text className='text-red-500 text-center font-semibold'>Cancelar Participação</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
