import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { getFirestore, collection, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  const fetchEvents = () => {
    const userId = auth.currentUser.uid;
    const attendancesRef = doc(db, 'attendances', userId);

    onSnapshot(attendancesRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userAttendance = docSnap.data();
        const acceptedEvents = userAttendance.accepted || [];

        const eventsRef = collection(db, 'events');
        const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
          const eventsData = querySnapshot.docs
            .map(doc => {
              const eventData = doc.data();
              return { id: doc.id, ...eventData };
            })
            .filter(event => acceptedEvents.includes(event.id));

          setEvents(eventsData);
        });

        return () => unsubscribe();
      } else {
        console.log("Usuário não tem participação registrada.");
      }
    });
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

      {events && events.length > 0 ? (
        <FlatList
          className="bg-white"
          style={{ backgroundColor: 'white' }}
          data={events}
          renderItem={({ item }) => (
            <View>
              <EventListItem event={item} />
              <Pressable
                className="mb-2 rounded-md bg-gray-100 p-3"
                onPress={() => confirmUnregisterEvent(item.id)}
              >
                <Text className="text-center font-semibold text-red-500">
                  Cancelar Participação
                </Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View>
          <Text className='text-lg text-center my-20'>Sem participações</Text>
        </View>
      )}
    </View>
  );
};
