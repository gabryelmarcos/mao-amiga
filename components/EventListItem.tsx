import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, SafeAreaView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { db } from '~/utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function EventListItem({ event }) {
  const [numeroParticipantes, setNumeroParticipantes] = useState(0);

  useEffect(() => {
    const attendanceRef = collection(db, 'attendances');
    const unsubscribe = onSnapshot(attendanceRef, (querySnapshot) => {
      let count = 0;
      querySnapshot.forEach((doc) => {
        const accepted = doc.data().accepted || [];
        if (accepted.includes(event.id)) {
          count++;
        }
      });
      setNumeroParticipantes(count);
    });
    return () => unsubscribe();
  }, [event.id]);

  return (
    <SafeAreaView className="px-4 bg-white">
      <Link href={`/${event.id}`} asChild>
        <Pressable className="mb-4 p-4 bg-white rounded-2xl shadow-sm shadow-black/5">
          <View className="flex-row gap-4">
            {/* Event Image with Category Badge */}
            <View className="relative">
              <Image 
                source={{ uri: event.image_uri || 'https://placehold.co/600x400/EEE/CCC' }} 
                className="w-24 h-24 rounded-xl" 
              />
              <View className="absolute top-1 right-1 bg-indigo-500/95 px-2 py-1 rounded-full flex-row items-center">
                <Feather name="tag" size={12} color="white" />
                <Text className="text-white text-xs font-medium ml-1" numberOfLines={1}>
                  {event.category || 'Evento'}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1" numberOfLines={2}>
                {event.title}
              </Text>
              
              {/* Location and Time */}
              <View className="flex-row items-center mb-2 gap-2">
                <View className="flex-row items-center">
                  <Feather name="map-pin" size={14} color="#6b7280" />
                  <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>
                
                <View className="flex-row items-center ml-2">
                  <Feather name="clock" size={14} color="#6b7280" />
                  <Text className="text-sm text-gray-600 ml-1">
                    {dayjs(event.date?.toDate()).format('HH:mm')}
                  </Text>
                </View>
              </View>

              {/* Participants and Actions */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
                  <Feather name="users" size={14} color="#4b5563" />
                  <Text className="text-sm text-gray-700 ml-2">
                    {numeroParticipantes} Confirmados
                  </Text>
                </View>
                
                <View className="flex-row gap-3">
                  <Pressable className="p-2 bg-gray-100 rounded-full">
                    <Feather name="bookmark" size={18} color="#4b5563" />
                  </Pressable>
                  <Pressable className="p-2 bg-gray-100 rounded-full">
                    <Feather name="share" size={18} color="#4b5563" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}