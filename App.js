import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LivrariaProvider, useLivraria } from './contexts/LivrariaContext';
import { SessaoProvider, useSessao } from './contexts/SessaoContext';
import Login from './screens/Login';
import CadastroUsuario from './screens/CadastroUsuario';
import Home from './screens/Home';
import Detalhes from './screens/Detalhes';
import Favoritos from './screens/Favoritos';
import CadastroLivro from './screens/CadastroLivro';
import Usuarios from './screens/Usuarios';
import MinhaConta from './screens/MinhaConta';

const Stack = createNativeStackNavigator();

function Navegacao() {
  const { logado } = useSessao();
  const { cores, modoEscuro } = useLivraria();
  const temaBase = modoEscuro ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={{ ...temaBase, colors: {
      ...temaBase.colors, background: cores.fundo, card: cores.superficie,
      text: cores.texto, primary: cores.primaria, border: cores.borda,
    } }}>
      <StatusBar style={modoEscuro ? 'light' : 'dark'} />
      <Stack.Navigator>
        {logado ? (
          <Stack.Group navigationKey="sessao">
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Detalhes" component={Detalhes} options={{ title: 'Detalhes do livro' }} />
            <Stack.Screen name="Favoritos" component={Favoritos} />
            <Stack.Screen name="CadastroLivro" component={CadastroLivro} options={({ route }) => ({ title: route.params?.livro ? 'Editar livro' : 'Cadastrar livro' })} />
            <Stack.Screen name="Usuarios" component={Usuarios} options={{ title: 'Usuários' }} />
            <Stack.Screen name="MinhaConta" component={MinhaConta} options={{ title: 'Minha conta' }} />
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey="visitante">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} options={{ title: 'Criar conta' }} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LivrariaProvider>
        <SessaoProvider><Navegacao /></SessaoProvider>
      </LivrariaProvider>
    </SafeAreaProvider>
  );
}
