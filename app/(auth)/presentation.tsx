import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Usando o hook useRouter do expo-router

export default function Presentation() {
    const router = useRouter(); // Hook para navegação com expo-router

    // Função para navegar para a tela de login
    const goToLogin = () => {
        router.push('/login'); // Navegar para a tela de login
    };

    return (
        <View className="flex-1 bg-[#F5F5F5] items-center mt-15">
            <Image className="my-2 h-[250px] w-[231px]" source={require('~/assets/girlHeart.png')} />

            <Text className="text-[24px] font-bold px-5 text-center text-[#4A4A4A]">
                A solidariedade começa com um ato de carinho.
            </Text>

            <Text className="text-[18px] px-5 text-center text-[#707070] mt-2 mb-5">
                Junte-se a nós e faça a diferença onde mais importa.
            </Text>

            {/* Botão de seta com círculo azul */}
            <TouchableOpacity onPress={goToLogin} className="mt-5">
                <View className="w-16 h-16 rounded-full bg-[#007BFF] justify-center items-center">
                    <Text className="text-[30px] text-white">→</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
