import { StatusBar } from 'expo-status-bar';
import { Alert, AppState, StyleSheet, Text, View } from 'react-native';
import {Platform} from 'react-native';
import {useFonts} from 'expo-font'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './Screens/Welcome';
import VirtualTopup from './Screens/VirtualTopup';
import ViewRequestWithId from './Screens/ViewRequestWithId';
import ViewRequest from './Screens/ViewRequest';
import UploadScreen from './Screens/UploadScreen';
import Television from './Screens/Television';
import SignUp from './Screens/SignUp';
import Settings from './Screens/Settings';
import SetPrice from './Screens/SetPrice';
import ServiceHistory from './Screens/ServiceHistory';
import ReNegotiate from './Screens/ReNegotiate';
import RateCustomer from './Screens/RateCustomer';
import ProfilePicsView from './Screens/ProfilePicsView';
import NotificationSetup from './Screens/NotificationSetup';
import Notifications from './Screens/NotificationScreen';
import Login from './Screens/Login';
import Internet from './Screens/Internet';
import ForgotPassword from './Screens/ForgotPassword';
import Education from './Screens/Education';
import Disco from './Screens/Disco';
import Complaince from './Screens/Complaince';
import Chat from './Screens/Chat';
import BillPayment from './Screens/BillPayment';
import Bet from './Screens/Bet';
import Availability from './Screens/Availability';
import AddToWallet from './Screens/AddToWallet';
import AcceptedRequest from './Screens/AcceptedRequest';
import Details from './Screens/Details';
import AuthContextProvider, { AuthContext } from './utils/AuthContext';
import { useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {FontAwesome5, Ionicons} from '@expo/vector-icons'
import * as Notification from 'expo-notifications'
import { BiometricSetup } from './utils/AuthRoute';
import TransactionPin from './Screens/TransactionPin';
import Biometric from './Screens/Biometric';
import * as Device from 'expo-device';
import PasswordReset from './Screens/PasswordReset';
import NotificationScreen from './Screens/NotificationScreen';
import FeedBack from './Screens/FeedBack';
import NetInfo from "@react-native-community/netinfo"
import RNRestart from 'react-native-restart'
import FirstDisplayScreen from './Screens/FirstDisplayScreen';
import TelevisionIos from './Screens/TelevisionIos';
import DiscoIos from './Screens/DiscoIos';
import PersonalRequest from './Screens/PersonalRequest';
import TermsAndCondition from './Screens/TermsAndCondition';
import LoadingOverlay from './Component/Ui/LoadingOverlay';
import { Color } from './Component/Ui/GlobalStyle';


Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator()

const Tabs = createBottomTabNavigator()




export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  
  const unsuscribe = NetInfo.addEventListener((state) => {
    if(state.isConnected === false){
      Alert.alert("No Internet Connection", "Please check your internet connection and try again!", [{
        text: "Reload App",
        onPress: () => RNRestart.restart()
      }])
    }else if(state.isConnected === true){
    }
  })

  useEffect(() => {
    unsuscribe()
  })


  const [fontloaded] =  useFonts({
    'poppinsRegular': require("./assets/Fonts/Poppins-Regular.ttf"),
    'poppinsMedium': require("./assets/Fonts/Poppins-Medium.ttf"),
    'poppinsSemiBold': require("./assets/Fonts/Poppins-SemiBold.ttf"),
    'poppinsBold': require("./assets/Fonts/Poppins-Bold.ttf"),
    'poppinsBold': require("./assets/Fonts/Inter-Bold.ttf"),
    'interBold': require("./assets/Fonts/Inter-Bold.ttf"),
    'interMedium': require("./assets/Fonts/Inter-Medium.ttf"),
    'interRegular': require("./assets/Fonts/Inter-Regular.ttf"),
  })

  
  if(!fontloaded){
    return <LoadingOverlay message={'...'}/>
  }


  
  function TabBottom(){
    return(
      <Tabs.Navigator
      sceneContainerStyle={{backgroundColor:'white'}}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle:{backgroundColor: Color.new_color}
      }}
      >
        <Tabs.Screen
            name='Welcome'
            component={Welcome}
            options={{
              tabBarIcon:({focused}) => (
                <View style={{alignItems:'center'}}>
                    <Ionicons name="home" size={24} color={focused ? Color.white : '#d3d3d3'} />
                  <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3'}}>Home</Text>
                </View>
              ),
            }}
        /> 

        <Tabs.Screen
          name='Compliance'
          component={Complaince}
          options={{
            tabBarIcon:({focused}) => (
              <View style={{alignItems:'center'}}>
                  <Ionicons name="document-attach" size={24} color={focused ? Color.white : "#d3d3d3"} />
                <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : "#d3d3d3"}}>Compliance</Text>
              </View>
            ),
          }}
        />

      

      <Tabs.Screen
        name='ViewRequest'
        component={ViewRequest}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', backgroundColor:Color.orange_300, }}>
             <FontAwesome5 name="clipboard-list" size={24} color={focused ? Color.white : '#d3d3d3'}/>
             <Text style={{fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3', fontSize:8}}>Request</Text>
            </View>
           ),
        }}
     />


        <Tabs.Screen
          name='AcceptedRequest'
          component={AcceptedRequest}
          options={{
            tabBarIcon:({focused}) => (
              <View style={{alignItems:'center'}}>
                    <Ionicons name="checkmark-done-outline" size={24} color={focused ? Color.white : '#d3d3d3'} />
                <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3'}}>Accepted</Text>
              </View>
            ),
          }}
        /> 


      <Tabs.Screen
          name='logout'
          component={Settings}
          options={{
            tabBarIcon:({focused}) => (
              <View style={{alignItems:'center'}}>
                    <Ionicons name="settings" size={24} color={focused ? Color.white : '#d3d3d3'} />
                <Text style={{ fontSize:8, fontFamily: 'poppinsRegular', color: focused ? Color.white : '#d3d3d3'}}>Settings</Text>
              </View>
            ),
          }}
        />
      </Tabs.Navigator>
    )
  }


  //NOT AUTHENTICATED ROUTE/SCREENS
  function AuthStack(){

    
    return (
      <Stack.Navigator
      screenOptions={{
        contentStyle:{backgroundColor: "#fff"}
      }}
      >
        <Stack.Screen
          name='FirstDisplayScreen'
          component={FirstDisplayScreen}
          options={{
            headerShown: false
          }} 
        />

        <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown: false
        }}
        />

        <Stack.Screen
        name='SignUp'
        component={SignUp}
        options={{
          headerShown: false
        }}
        />

      <Stack.Screen
        name='TermsAndCondition'
        component={TermsAndCondition}
        options={{
          headerShown: false
        }}
      />


        <Stack.Screen
        name='ForgotPassword'
        component={ForgotPassword}
        options={{
          headerShown: false
        }}
        />
    </Stack.Navigator>
    )
  } 

  //AUTHENTICATED  ROUTE/SCREENS
  function AuthenticatedStack(){
    const authCtx = useContext(AuthContext)

   useEffect(() => {
      try {
        checkLastLoginTimestamp()
      } catch (error) {
        return;
      }
    },[])
    
      // console.log(authCtx.lastLoginTimestamp + " timestamp")
  
      const checkLastLoginTimestamp =  () => {
        const storedTimestamp = authCtx.lastLoginTimestamp
        const lastLoginTimestamp = new Date(storedTimestamp);
        const currentTimestamp = new Date();
    
        if(authCtx.lastLoginTimestamp === null || undefined || ""){
          return 
        }else{
          const timeDifferenceInMinutes = Math.floor(
            (currentTimestamp - lastLoginTimestamp) / (1000 * 60)
          );
          const authenticationThresholdInMinutes = 10;
      
          if (timeDifferenceInMinutes > authenticationThresholdInMinutes) {
            Alert.alert("Session Timeout", "Session has expired")
            authCtx.logout()
          }
        }
      };
  
  
      
    return (
      <Stack.Navigator
          screenOptions={{
            contentStyle:{backgroundColor: "#fff"}
          }}
          >

         <Stack.Screen
          name='Tabs'
          component={TabBottom}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name='VirtualTopup'
          component={VirtualTopup}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name='ViewRequestWithId'
          component={ViewRequestWithId}
          options={{
            headerShown: false
          }}
        />
        
        <Stack.Screen
        name='PersonalRequest'
        component={PersonalRequest}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='UploadScreen'
        component={UploadScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='Television'
        component={Television}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='TelevisionIos'
        component={TelevisionIos}
        options={{
          headerShown: false
        }}
      />


      {/* <Stack.Screen
        name='Settings'
        component={Settings}
        options={{
          headerShown: false
        }}
      /> */}

      <Stack.Screen
        name='SetPrice'
        component={SetPrice}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='ServiceHistory'
        component={ServiceHistory}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='ReNegotiate'
        component={ReNegotiate}
        options={{
          headerShown: false
        }}
      />
    
      <Stack.Screen
        name='RateCustomer'
        component={RateCustomer}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='ProfilePicsView'
        component={ProfilePicsView}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='NotificationSetup'
        component={NotificationSetup}
        options={{
          headerShown: false
        }}
      />

      
      <Stack.Screen
        name='Notifications'
        component={Notifications}
        options={{
          headerShown: false
        }}
      />

     
      <Stack.Screen
        name='Internet'
        component={Internet}
        options={{
          headerShown: false
        }}
      />


      
      <Stack.Screen
        name='Education'
        component={Education}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='Disco'
        component={Disco}
        options={{
          headerShown: false
        }}
      /> 

    <Stack.Screen
      name='DiscoIos'
      component={DiscoIos}
      options={{
        headerShown: false
      }}
    />

      <Stack.Screen
        name='Details'
        component={Details}
        options={{
          headerShown: false
        }}
      />


            
      {/* <Stack.Screen
        name='Complaince'
        component={Complaince}
        options={{
          headerShown: false
        }}
      /> */}

      <Stack.Screen
        name='Chat'
        component={Chat}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='BillPayment'
        component={BillPayment}
        options={{
          headerShown: false
        }}
      />

    <Stack.Screen
        name='Bet'
        component={Bet}
        options={{
          headerShown: false
        }}
      />

      
      <Stack.Screen
        name='Availability'
        component={Availability}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='AddToWallet'
        component={AddToWallet}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='TransactionPin'
        component={TransactionPin}
        options={{
          headerShown: false
        }} 
      />
      <Stack.Screen
        name='Biometric'
        component={Biometric}
        options={{
          headerShown: false
        }} 
      />

      <Stack.Screen
        name='PasswordReset'
        component={PasswordReset}
        options={{
          headerShown: false
        }} 
      />

      <Stack.Screen
        name='NotificationScreen'
        component={NotificationScreen}
        options={{
          headerShown: false
        }} 
      />

      <Stack.Screen
        name='FeedBack'
        component={FeedBack}
        options={{
          headerShown: false
        }} 
      />
      
      </Stack.Navigator>
    )
  }


  const Navigation = () => {
    const authCtx = useContext(AuthContext)

    return(
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack/>}
        {authCtx.isAuthenticated && <AuthenticatedStack/>}
      </NavigationContainer>
  )
  }

  
  

  const Root = () => {
  const authCtx = useContext(AuthContext)
  const [isTrying, setisTrying] = useState(false)


  async function fetchData(){
    setisTrying(true)
    const storedToken = await AsyncStorage.getItem('helpertoken')
    const storedId = await AsyncStorage.getItem('helperId')
    const storedemail = await AsyncStorage.getItem('helperEmail')
    const storedfirstname = await AsyncStorage.getItem('helperFirstname')
    const storedlastname = await AsyncStorage.getItem('helperLastname')
    const storedcatid = await AsyncStorage.getItem('helperCatId')
    const storedsubcatid = await AsyncStorage.getItem('helperSubCatId')
    const storedphone = await AsyncStorage.getItem('helperPhone')
    const storedpicture = await AsyncStorage.getItem('helperPicture')
    const storedshowamount = await AsyncStorage.getItem('helperShowAmount')
    const storedlastlogintime = await AsyncStorage.getItem('helperlastLoginTimestamp')
    const storeduserid = await AsyncStorage.getItem('helperuserid')
    const storedsumtot = await AsyncStorage.getItem('helpersumtot')

    
    

    if(storedToken && storedId && storedemail){
      authCtx.authenticated(storedToken)
      authCtx.helperId(storedId)
      authCtx.helperEmail(storedemail)
      authCtx.helperFirstName(storedfirstname)
      authCtx.helperLastName(storedlastname)
      authCtx.helperCatId(storedcatid)
      authCtx.helperSubCatId(storedsubcatid)
      authCtx.helperPhone(storedphone)
      authCtx.helperShowAmount(storedshowamount)
      authCtx.helperPicture(storedpicture)
      authCtx.helperlastLoginTimestamp(storedlastlogintime)
      authCtx.helperuserid(storeduserid)
      authCtx.helpersumtot(storedsumtot)
    }

    setisTrying(false)
  }



    useEffect(() => {
      fetchData()
    }, [])

    if(isTrying){
      return <LoadingOverlay message={"..."}/>
    }

    return <Navigation/>

  }








  return (
    <>
      <StatusBar style="dark-content"/>
      <AuthContextProvider>
        <Root/>
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
