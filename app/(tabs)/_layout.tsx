import { Link, Tabs, Redirect } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '~/contexts/AuthProvider';

export default function TabLayout() {

  const {isAuthenticated} = useAuth();
  // console.warn( isAuthenticated)

  if (!isAuthenticated) {
    return <Redirect href={'/login'} />
  }

  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: 'Novo Evento',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}

      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

    </Tabs>
  );
}
