import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { db } from '~/utils/firebase'; // Importando Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function EventListItem({ event }) {
  const [numeroParticipantes, setNumeroParticipantes] = useState(0);

  useEffect(() => {
    // Referência à coleção 'attendance' no Firestore
    const attendanceRef = collection(db, 'attendances');

    // Filtrando por event_id para contar participantes desse evento
    const q = query(attendanceRef, where('event_id', '==', event.id));

    // Listener para mudanças em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Atualiza o número de participantes com base no número de documentos retornados
      setNumeroParticipantes(querySnapshot.size);
    });

    // Limpeza do listener quando o componente for desmontado
    return () => unsubscribe();
  }, [event.id]);

  return (
    <Link href={`/${event.id}`} asChild>
      <Pressable className="gap-3 border-b-2 border-gray-100 pb-3">
        <View className="flex-row">
          <View className="flex-1 gap-2">
            <Text className="text-lg font-semibold uppercase text-amber-800">
              {dayjs(event.datetime).format('ddd, D MMM')} • {dayjs(event.datetime).format('h:mm A')}
            </Text>
            <Text className="text-xl font-bold" numberOfLines={2}>
              {event.title}
            </Text>

            <Text className="text-gray-700">{event.location}</Text>
          </View>
          {/* Event Image */}
          <Image source={{ uri: event.image_uri }} className="aspect-video w-2/5 rounded-xl" />
        </View>

        {/* Footer */}
        <View className="flex-row gap-3">
          <Text className="mr-auto text-gray-700">{numeroParticipantes} indo</Text>
          <Feather name="bookmark" size={20} color="gray" />
          <Feather name="share" size={20} color="gray" />
        </View>
      </Pressable>
    </Link>
  );
}
