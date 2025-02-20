import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { auth } from '~/utils/firebase'; 
import { User} from 'firebase/auth'; 

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null); 
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
   
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); 
      setIsReady(true); 
    });


    return () => unsubscribe();
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;  
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
