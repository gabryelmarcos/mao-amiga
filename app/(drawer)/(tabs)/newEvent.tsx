import { View, Text, TextInput, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '~/contexts/AuthProvider';
import { db } from '~/utils/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import api from '~/utils/apiCep';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NewEvent() {
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [location, setLocation] = useState("");
  const [image_uri, setImage_uri] = useState("");

  const { user } = useAuth();

  const fetchAddress = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await api.get(`/${cep}/json/`);
        if (response.data && response.data.logradouro && response.data.bairro) {
          setStreet(response.data.logradouro);
          setNeighborhood(response.data.bairro);
          setLocation(`${response.data.logradouro}, ${response.data.bairro}`);
        }
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        alert('Erro ao buscar endereço');
      }
    }
  };

  const handleCepChange = (newCep) => {
    setCep(newCep);
    if (newCep.length === 8) fetchAddress(newCep);
  };

  const createEvent = async () => {
    try {
      setLoading(true);
      const randomImageUrl = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;

      const eventRef = doc(collection(db, 'events'));
      await setDoc(eventRef, {
        title,
        description,
        location,
        image_uri: randomImageUrl,
        id_ong: user.uid,
        createdAt: serverTimestamp(),
      });

      alert('Evento criado com sucesso!');
      setLoading(false);
      // Reset fields
      setTitle(''); setDescription(''); setLocation('');
      setCep(''); setStreet(''); setNeighborhood(''); setImage_uri('');
    } catch (error) {
      console.error("Erro ao criar evento: ", error);
      setLoading(false);
      alert('Erro ao criar evento');
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{
        title: "Novo Evento",
        headerTintColor: 'white',
        headerTitleStyle: { 
          fontFamily: 'Inter_600SemiBold',
          fontSize: 18,
          color: 'black'
        },
        headerRight: () => (
          <MaterialCommunityIcons 
            name="party-popper" 
            size={24} 
            color="white" 
            style={{ marginRight: 16 }}
          />
        )
      }} />

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="format-title" size={20} color="#db2777" />
            <Text className="text-rose-600 text-sm font-semibold ml-2">Título do Evento</Text>
          </View>
          <TextInput
            placeholder="Ex: Arrecadação de Agasalhos"
            placeholderTextColor="#fda4af"
            value={title}
            onChangeText={setTitle}
            className="bg-white rounded-lg p-4 text-rose-900 border border-rose-100 focus:border-rose-300 shadow-sm"
          />
        </View>

        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="text-box-outline" size={20} color="#db2777" />
            <Text className="text-rose-600 text-sm font-semibold ml-2">Descrição Detalhada</Text>
          </View>
          <TextInput
            placeholder="Descreva o propósito e necessidades do evento..."
            placeholderTextColor="#fda4af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            className="bg-white rounded-lg p-4 text-rose-900 border border-rose-100 focus:border-rose-300 h-32 shadow-sm"
          />
        </View>

        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#db2777" />
            <Text className="text-rose-600 text-sm font-semibold ml-2">Localização</Text>
          </View>
          
          <View className="mb-4">
            <TextInput
              placeholder="Digite o CEP (apenas números)"
              placeholderTextColor="#fda4af"
              value={cep}
              onChangeText={handleCepChange}
              className="bg-white rounded-lg p-4 text-rose-900 border border-rose-100 focus:border-rose-300 shadow-sm mb-3"
              keyboardType="numeric"
              maxLength={8}
            />
            <TextInput
              placeholder="Rua/Avenida"
              placeholderTextColor="#fda4af"
              value={street}
              onChangeText={setStreet}
              className="bg-white rounded-lg p-4 text-rose-900 border border-rose-100 focus:border-rose-300 shadow-sm mb-3"
            />
            <TextInput
              placeholder="Bairro"
              placeholderTextColor="#fda4af"
              value={neighborhood}
              onChangeText={setNeighborhood}
              className="bg-white rounded-lg p-4 text-rose-900 border border-rose-100 focus:border-rose-300 shadow-sm"
            />
          </View>
        </View>
      </ScrollView>

      <Pressable
        className="mx-4 mb-6 bg-rose-600 rounded-xl p-4 shadow-lg active:bg-rose-700 flex-row justify-center items-center"
        onPress={createEvent}
        disabled={loading}
      >
        <MaterialCommunityIcons 
          name="gift-outline" 
          size={24} 
          color="white" 
          className="mr-2"
        />
        <Text className="text-center text-white font-semibold text-lg">
          {loading ? 'Criando Evento...' : 'Publicar Evento'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}