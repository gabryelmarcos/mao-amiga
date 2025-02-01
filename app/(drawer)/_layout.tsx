import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export default function DrawerLayout() {

    
    //   const {isAuthenticated} = useAuth();
    //   // console.warn( isAuthenticated)
    
    //   if (isAuthenticated) {
    //     return <Redirect href='/login' />
    //   }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerShown: false, // Desativa o cabeçalho
                    drawerType: 'front', // Faz o Drawer aparecer na frente da tela
                }}
            >

                <Drawer.Screen
                    name="(tabs)"
                    options={{ drawerLabel: 'Home', headerShown: false, }} // Nome que aparece no drawer
                />

                <Drawer.Screen
                    name="myEvents"
                    options={{ drawerLabel: 'Minhas Participações' }} // Nome que aparece no drawer
                />

                {/* <Drawer.Screen
                    name="newEvent"
                    options={{ drawerLabel: 'Adicionar Evento' }} // Nome que aparece no drawer
                /> */}
            </Drawer>
        </GestureHandlerRootView>
    );
}
