import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home';
import MainScreen from './src/screens/MainScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

function App() {
  return (
      <NavigationContainer>
         <Stack.Navigator initialRouteName="LoginScreen">
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
           <Stack.Screen name="Registration" component={RegistrationScreen} />
           <Stack.Screen name="Home" component={Home} />
           <Stack.Screen name="Profile" component={MainScreen} />
         </Stack.Navigator>
            <Toast />
       </NavigationContainer>
  );
}

export default App;
