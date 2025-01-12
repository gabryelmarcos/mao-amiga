import { View, Text, TextInput, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '~/contexts/AuthProvider';
import { db } from '~/utils/firebase'; // Certifique-se de que a configuração do Firebase está correta
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function NewEvent() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image_uri, setImage_uri] = useState("");

  const { user } = useAuth(); // Pega o usuário autenticado do contexto

  const createEvent = async () => {
   

    try {
      setLoading(true);

      // Passo 1: Obter uma URL de imagem aleatória do Lorem Picsum
      const randomImageUrl = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;

      // Passo 2: Criar o evento no Firebase Firestore
      const eventRef = doc(collection(db, 'events')); // Cria uma referência única na coleção 'events'

      await setDoc(eventRef, {
        title,
        description,
        location,
        image_uri: randomImageUrl,
        id_ong: user.uid, // ID da ONG (usuário autenticado)
        createdAt: serverTimestamp(), // Timestamp de criação
      });

      alert('Evento criado com sucesso!');
      setLoading(false);

      // Limpar os campos após a criação
      setTitle('');
      setDescription('');
      setLocation('');
      setImage_uri('');
    } catch (error) {
      console.error("Erro ao criar evento: ", error);
      setLoading(false);
      alert('Erro ao criar evento');
    }
  };

  return (
    <View className="flex-1 gap-3 bg-white p-5">
      <Stack.Screen options={{ title: "Novo Evento" }} />

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        placeholder="Localização"
        value={location}
        onChangeText={setLocation}
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        className="min-h-32 rounded-md border border-gray-200 p-3"
      />

      <Pressable
        className="mt-auto mb-9 items-center rounded-md bg-red-500 p-3 px-8"
        onPress={createEvent}
        disabled={loading}
      >
        <Text className="text-lg font-bold text-white">
          {loading ? 'Criando...' : 'Criar Novo Evento'}
        </Text>
      </Pressable>
    </View>
  );
}
