import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerShown: false,
                    drawerType: 'front',
                }}
            >

                <Drawer.Screen
                    name="(tabs)"
                    options={{ drawerLabel: 'Home', headerShown: false }}
                />

                <Drawer.Screen
                    name="myEvents"
                    options={{ drawerLabel: 'Minhas Participações' }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
