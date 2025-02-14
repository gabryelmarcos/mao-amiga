import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'  // Importando o useRouter

export default function SuccessScreen() {
  const router = useRouter();  // Inicializando o router

  const handleExploreMoreEvents = () => {
    router.push('/');  // Navegar para a rota index (ou a rota principal)
  }

  return (
    <LinearGradient
      colors={['#a7f3d0', '#34d399']} // Gradiente verde suave
      style={{ flex: 1 }} // Garantir que o gradiente ocupe toda a tela
    >
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center space-y-2.5 max-w-[300px]">
          {/* Ícone */}
          <MaterialIcons
            name="check-circle"
            size={96}
            color="#ec4899" // Cor rosa para o ícone
            style={{
              shadowColor: '#db2777',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 15
            }}
          />

          {/* Mensagens */}
          <View className="items-center my-3">
            <Text className="text-2xl font-bold text-center text-[#064e3b]">
              Inscrição Concluída! 🎉
            </Text>
            <Text className="text-lg text-center text-[#065f46] leading-6">
              Sua solicitação foi enviada com sucesso! Aguarde o contato da ONG para confirmação.
            </Text>
          </View>

          {/* Botão gradiente com rosa */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: 20,
              shadowColor: '#db2777',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10
            }}
            onPress={handleExploreMoreEvents}  // Adicionando o evento de clique
          >
            <LinearGradient
              colors={['#ec4899', '#db2777']} // Gradiente rosa
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                space: 12
              }}
            >
              <MaterialIcons name="search" size={22} color="white" />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>
                Explorar Mais Eventos
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Elemento decorativo */}
          <View className="absolute z-[-10] w-[200%] h-[200%]">
            <View className="absolute top-[33%] left-[25%] w-40 h-40 bg-[#a7f3d0] rounded-full" />
            <View className="absolute top-[50%] right-[25%] w-32 h-32 bg-[#34d399] rounded-full" />
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}
