import { View, Text, TextInput, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '~/contexts/AuthProvider';
import { db } from '~/utils/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

import api from '~/utils/apiCep';  // Certifique-se de que o arquivo apiCep.js está configurado corretamente.
import * as Updates from 'expo-updates';  // Importando o módulo Updates do Expo.

export default function NewEvent() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cep, setCep] = useState("");  // Campo para armazenar o CEP
  const [street, setStreet] = useState("");  // Campo para armazenar a rua
  const [neighborhood, setNeighborhood] = useState("");  // Campo para armazenar o bairro
  const [location, setLocation] = useState("");  // Para concatenar tudo que vai para o Firebase
  const [image_uri, setImage_uri] = useState("");

  const { user } = useAuth();

  // Função para buscar o endereço usando o CEP
  const fetchAddress = async (cep) => {
    if (cep.length === 8) {  // Verifica se o CEP tem 8 caracteres (formato correto)
      try {
        const response = await api.get(`/${cep}/json/`);

        if (response.data && response.data.logradouro && response.data.bairro) {
          setStreet(response.data.logradouro);
          setNeighborhood(response.data.bairro);
          // Concatenando os dados para o campo location
          const fullLocation = `${response.data.logradouro}, ${response.data.bairro}`;
          setLocation(fullLocation);
        }
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        alert('Erro ao buscar endereço');
      }
    }
  };

  // Quando o CEP for alterado, buscamos o endereço
  const handleCepChange = (newCep) => {
    setCep(newCep);
    if (newCep.length === 8) {
      fetchAddress(newCep);
    }
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

      // Reinicia o aplicativo após a criação bem-sucedida do evento
      await Updates.reloadAsync();  // Reinicia o app

      setLoading(false);

      // Limpa os campos
      setTitle('');
      setDescription('');
      setLocation('');
      setCep('');
      setStreet('');
      setNeighborhood('');
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
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        className="min-h-32 rounded-md border border-gray-200 p-3"
      />

      <TextInput
        placeholder="Cep"
        value={cep}
        onChangeText={handleCepChange}
        className="rounded-md border border-gray-200 p-3"
        keyboardType="numeric"
        maxLength={8}  // Para garantir que o CEP tenha no máximo 8 dígitos
      />

      <TextInput
        placeholder="Rua"
        value={street}
        onChangeText={setStreet}
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        placeholder="Bairro"
        value={neighborhood}
        onChangeText={setNeighborhood}
        className="rounded-md border border-gray-200 p-3"
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
