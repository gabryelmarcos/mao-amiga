import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { auth } from '~/utils/firebase'; // Caminho do arquivo de configuração do Firebase
import { User} from 'firebase/auth'; // Importando o tipo correto do Firebase

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null); // Usando o tipo de User correto
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Listener para mudanças de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Define o usuário no estado
      setIsReady(true); // Marca como pronto para renderizar a UI
    });

    // Cleanup: remove o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  if (!isReady) {
    return <ActivityIndicator />; // Exibe o indicador de carregamento enquanto a autenticação está sendo verificada
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
