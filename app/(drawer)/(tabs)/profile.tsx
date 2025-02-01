import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { auth, db } from '~/utils/firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [isONG, setIsONG] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFullName(userData.full_name || '');
            setUsername(userData.username || '');
            setWebsite(userData.website || '');

            if (userData.typeUser === 'ong') {
              setIsONG(true);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar o perfil do usuário:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateProfile = async () => {
    if (loading) return;

    setLoading(true);

    if (!user?.uid) {
      Alert.alert('Erro', 'Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
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
      setLoading(false);
    }
  };

  function handleONGLogin() {
    router.push('/myEvents');
  }

  return (
    <View className="flex-1 gap-3 bg-white p-5">
      <Stack.Screen options={{ title: 'Perfil' }} />

      <TextInput
        editable={false}
        value={user?.email || 'Carregando...'}
        placeholder="Email"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3 text-gray-600"
      />

      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        value={website}
        onChangeText={setWebsite}
        placeholder="Website"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      {isONG && (
        <Pressable
          onPress={handleONGLogin}
          disabled={loading}
          className="items-center rounded-md border-2 border-red-500 p-3 px-8"
        >
          <Text className="text-lg font-bold text-red-500">Criar um novo Evento</Text>
        </Pressable>
      )}

      <Pressable
        onPress={updateProfile}
        disabled={loading}
        className="items-center rounded-md border-2 border-red-500 p-3 px-8"
      >
        <Text className="text-lg font-bold text-red-500">Salvar</Text>
      </Pressable>

      <Button title="Sair da conta" onPress={() => signOut(auth)} />
    </View>
  );
}
