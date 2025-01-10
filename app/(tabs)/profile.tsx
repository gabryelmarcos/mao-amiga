import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider'; // Contexto de autenticação
import { auth, db } from '~/utils/firebase'; // Importando o Firebase config (auth e db)
import { getDoc, setDoc, doc } from 'firebase/firestore'; // Firestore
import { signOut } from 'firebase/auth'; // Função de logout

export default function Profile() {
  const { user } = useAuth(); // Sessão vem do contexto de autenticação
  const [fullName, setFullName] = useState(''); // Estado para armazenar o nome completo
  const [username, setUsername] = useState(''); // Estado para armazenar o nome de usuário
  const [website, setWebsite] = useState(''); // Estado para armazenar o site
  const [loading, setLoading] = useState(false); // Estado de carregamento

  useEffect(() => {
    // Função para buscar o perfil do Firestore
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid); // Referência do documento do usuário
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            // Se o documento existe, pega os dados salvos
            const userData = docSnap.data();
            setFullName(userData.full_name || '');
            setUsername(userData.username || '');
            setWebsite(userData.website || '');
          }
        } catch (error) {
          console.error('Erro ao buscar o perfil do usuário:', error);
        }
      }
    };

    fetchUserProfile(); // Chama a função na inicialização
  }, [user]); // Recarrega o perfil quando o usuário muda

  const updateProfile = async () => {
    if (loading) return; // Impede múltiplas requisições simultâneas

    setLoading(true); // Ativa o estado de carregamento

    if (!user?.uid) {
      Alert.alert('Erro', 'Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid); // Referência do documento do usuário
      // Atualiza os dados do usuário no Firestore
      await setDoc(userDocRef, {
        full_name: fullName,
        username,
        website,
      }, { merge: true });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      Alert.alert('Erro', 'Falha ao atualizar o perfil.');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <View className="flex-1 gap-3 bg-white p-5">
      <Stack.Screen options={{ title: 'Profile' }} />

      {/* Campo de email, não editável */}
      <TextInput
        editable={false}
        value={user?.email || 'Carregando...'}  // Exibe 'Carregando...' enquanto não tiver email
        placeholder="Email"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3 text-gray-600"
      />

      {/* Campo de nome completo */}
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      {/* Campo de nome de usuário */}
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      {/* Campo de site */}
      <TextInput
        value={website}
        onChangeText={setWebsite}
        placeholder="Website"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      {/* Botão para salvar as alterações */}
      <Pressable
        onPress={updateProfile}
        disabled={loading}
        className="items-center rounded-md border-2 border-red-500 p-3 px-8"
      >
        <Text className="text-lg font-bold text-red-500">Save</Text>
      </Pressable>

      {/* Botão para deslogar */}
      <Button title="Sign out" onPress={() => signOut(auth)} />
    </View>
  );
}
