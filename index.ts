import { registerRootComponent } from 'expo';

import App from './src/app/App'; 
import BottomNavigator from './src/navigation/bottomnavigator'; /* BottomNavigator é apenas pra testes! usar o App */
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
