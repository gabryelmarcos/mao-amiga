import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text, ScrollView } from 'react-native';
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
    <ScrollView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ 
        title: 'Perfil', 
        headerTitleAlign: 'center',
        headerTitleStyle: { color: '#1e293b' },
        headerShadowVisible: false
      }} />

      <View className="p-6 space-y-8">
        <View className="items-center space-y-4">
          <View className="w-20 h-20 bg-rose-500 rounded-full items-center justify-center shadow-lg">
            <Text className="text-white text-4xl">❤️</Text>
          </View>
          
          <View className="bg-emerald-100 px-4 py-3 rounded-full">
            <Text className="text-emerald-800 text-sm font-medium">
              Obrigado por sua colaboração! 🌟
            </Text>
          </View>
        </View>

        <View className="space-y-6">
          <View className="space-y-2">
            <Text className="text-xs text-slate-500 font-medium uppercase tracking-wide ml-2">
              Email
            </Text>
            <TextInput
              editable={false}
              value={user?.email || 'Carregando...'}
              className="bg-slate-100 p-4 rounded-xl text-slate-700 font-medium"
              placeholderTextColor="#64748b"
            />
          </View>

          <View className="space-y-2">
            <Text className="text-xs text-slate-500 font-medium uppercase tracking-wide ml-2">
              Nome Completo
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 shadow-sm"
              placeholder="Digite seu nome completo"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View className="space-y-2">
            <Text className="text-xs text-slate-500 font-medium uppercase tracking-wide ml-2">
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 shadow-sm"
              placeholder="Escolha um nome de usuário"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View className="space-y-2">
            <Text className="text-xs text-slate-500 font-medium uppercase tracking-wide ml-2">
              Website
            </Text>
            <TextInput
              value={website}
              onChangeText={setWebsite}
              className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 shadow-sm"
              placeholder="Adicione seu website"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View className="space-y-4">
          <Pressable
            onPress={updateProfile}
            disabled={loading}
            className="bg-rose-600 p-5 rounded-xl items-center shadow-lg active:bg-rose-700 active:opacity-90"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <Text className="text-white font-bold text-base">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </Pressable>

          {isONG && (
            <Pressable
              onPress={handleONGLogin}
              className="bg-white p-5 rounded-xl border-2 border-rose-500 items-center active:bg-rose-50"
            >
              <Text className="text-rose-600 font-semibold text-base">
                Gerenciar Eventos
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => signOut(auth)}
            className="p-4 items-center active:opacity-70"
          >
            <Text className="text-slate-500 text-base font-medium underline">
              Sair da Conta
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
