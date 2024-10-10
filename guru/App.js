import React, { useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './screens/Login';
import SignupPage from './screens/Signup';
import Welcome from './screens/Welcome';
import Home from './screens/Home'; 
import SetGoal from './screens/SetGoal';
import TaskManager from './screens/Calendar';
import EditProfile from './screens/Editprofile';
import AddRoutineScreen from './screens/AddRoutine';
import RoutinesScreen from './screens/Routinesscreen';
import SuggestedRoutinesScreen from './screens/Suggestedroutines';
import AiChatbotScreen from './screens/ChatbotScreen';
import SettingsScreen from './screens/SettingsScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, Header } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from './datastore/data';
import RoutineDetailsScreen from './screens/RoutineDetailsScreen';
import HeaderComp from './components/HeaderComp';
import Journal from './screens/Journal';
import { Retrieveit } from './controllers/LocalStorage';
import { useDataStore } from './datastore/data';
import { postLogin,getuser } from './controllers/Operations';
import LoadingScreen from './screens/LoadingScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Routines') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'TaskManager') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'Aiguru') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'Journal') {
            iconName = focused ? 'pencil' : 'pencil-outline'; // Changed to 'pencil' icon
          }

          return <Ionicons name={iconName} size={size} color={"orange"} />;
        }
      })}
    >
      <Tab.Screen name="Home" options={{header:()=>(<HeaderComp />)}} component={Home} />
      <Tab.Screen name="Routines" options={{headerShown:false}} component={RoutinesStack} />
      <Tab.Screen name="TaskManager" options={{headerShown:false}}   component={CalendarStack} />
      <Tab.Screen name="Aiguru" options={{headerShown:false}}  component={AiChatbotScreen} />
      <Tab.Screen name="Journal" options={{headerShown:true}}  component={Journal} />
    </Tab.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={TaskManager} />
      <Stack.Screen name="RoutineDetails" component={RoutineDetailsScreen} />
    </Stack.Navigator>
  );
}

function RoutinesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RoutinesScreen" component={RoutinesScreen} />
      <Stack.Screen name="SuggestedRoutines" component={SuggestedRoutinesScreen} />
      <Stack.Screen name="AddRoutine" component={AddRoutineScreen} />
      <Stack.Screen name="RoutineDetails" component={RoutineDetailsScreen} />
    </Stack.Navigator>
  );
}

function AuthStack({setAuth}) {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Signup" component={SignupPage} />
    </Stack.Navigator>
  );
}

export default function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const {setToken,setUser}=useDataStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkAuth=async()=>{
    const token = await Retrieveit('token');
    if (token) {
      setLoading(true);
      setToken(token);
      let curuser=await getuser(token);
      setUser(curuser);
      console.log(curuser);
      console.log("going to postlogin");
      await postLogin(curuser,token,1);
      console.log("going to home");
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }
  checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name='HomeTabs' component={HomeTabs}/>
          <Stack.Screen options={{headerShown:false}} name='SetG' component={SetGoal}/>
          <Stack.Screen options={{headerMode:'float'}} name="Profile" component={EditProfile} />
          <Stack.Screen options={{headerMode:'float'}} name='Settings' component={SettingsScreen} />
          <Stack.Screen options={{headerMode:'float'}} name='SuggestedRoutines' component={SuggestedRoutinesScreen} />
        </Stack.Navigator>
      ) : (
        (loading?<LoadingScreen/>:<AuthStack />)
      )}
    </NavigationContainer>
  );
}
