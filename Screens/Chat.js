import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext, useState, useCallback, useLayoutEffect } from 'react'
import { Color, marginStyle } from '../Components/Ui/GlobalStyle'
import { AuthContext } from '../utils/AuthContext'
import { CustomersUrl, GetCustomer } from '../utils/AuthRoute'
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import axios from 'axios'
import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'
import { Image } from 'expo-image'
import GoBack from '../Components/Ui/GoBack'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'

const Chat = ({navigation, route}) => {
  const [messages, setMessages] = useState([])
  const authCtx = useContext(AuthContext)
  const [customer, setCustomer] = useState('')
  const [premessage, setPreviousMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const bidid = route?.params?.bid_id
  const customerid = route?.params?.customerId

  useEffect(() => {
    const customerInfo = async () => {
    try {
        setIsLoading(true)
        const response = await GetCustomer(customerid, authCtx.token)
        setCustomer(response.data.data)
        setIsLoading(false)
    } catch (error) {
      setIsLoading(true)
      setIsLoading(false)
      return;
    }}
    customerInfo()
}, [])


useLayoutEffect(() => {
  const unsubscribe = async() => {
      // do something
      const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpchatview/${bidid}/helpers`
      try {
      const response = await axios.get(url, {
        headers:{
          Accept:'application/json',
          Authorization: `Bearer ${authCtx.token}`
        }
      })
        var count = Object.keys(response.data).length;
        let stateArray = []
        for (var i = 0; i < count; i++){
            stateArray.push({
              _id: response.data[i].id,
              createdAt: response.data[i].created_at,
              text: response.data[i].message,
              user:{
                _id: response.data[i].from_user_id,
                name: 'React Native',
                avatar: null
                // avatar: customer.picture === null ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLYtkaHut2_Xctb0hUZGZk7pbCbIzcoMSNA&usqp=CAU`: `https://phixotech.com/igoepp/public/customers/${customer.picture}`,
              },
            }, 
            )
            setPreviousMessage(response.data[i].from_user_id)
        }
        const descArr = stateArray.sort().reverse();
        setMessages(descArr)
      } catch (error) {
        console.log(error.response)
        Alert.alert("Error", "An error occured while fetching messages", [
          {
            text:'Ok',
            onPress: () => navigation.goBack()
          }
        ])
        return;
      }
    };
    unsubscribe();
    const intervalId = setInterval(unsubscribe, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
}, []);


const SendMessage = (text) => {
  const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpchat`
  // console.log(text)
  axios.post(url, {
      help_id: route?.params?.bid_id,
      from_user_id: authCtx.Id,
      to_user_id: route?.params.customerId,
      message: text,
      user_type: 'customer' 
  }, {
      headers:{
          Accept: 'application/json',
          Authorization: `Bearer ${authCtx.token}`
      }
  }).then((res) => {
      // console.log(res.data)
  }).catch((error) => {
      console.log(error.response.data)
      return;
  })
}


const onSend = useCallback((messages = []) => {
  setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  const {_id,createdAt,text,user} = messages[0]
  SendMessage(text)
}, [])

const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{ 
          right:{
              backgroundColor:  '#2e64e5'
          }
      }}
      textStyle={{ 
          right: {
              color: '#fff'
          }
      }}
    />
  )
}

const renderSend = (props) => {
  return(
      <Send {...props}>
          <View>
          <MaterialCommunityIcons style={{marginRight:5, marginBottom:5}} name="send-circle" size={32} color='#2e64e5' />
          </View>
      </Send>
  )
}

const scrollToBottomComponent = (props) => {
  return (
      <FontAwesome5 name="angle-double-down" size={22} color="#333" />
  )
}

  const CustomerId = authCtx.Id.toString()
    

  if(isLoading){
    return <LoadingOverlay message={"Loading messages"}/>
  }

  return (
    <>
    <Pressable style={{marginTop:marginStyle.marginTp + 10, marginHorizontal:10,   flexDirection:'row',}} onPress={() => navigation.goBack()}>
      
      <GoBack onPress={() => navigation.goBack()}></GoBack>
      {
        customer.picture === null ? 
          <Image style={styles.image} source={require("../assets/person-4.png")}/>
        :
        <Image style={styles.image} source={{uri: `https://phixotech.com/igoepp/public/customers/${customer.picture}`}}/>
      }
      <Text style={{fontSize: 14, fontFamily: 'poppinsSemiBold'}}>{customer.first_name} {customer.last_name}</Text>
      {/* <Text style={styles.chattxt}>Chat</Text> */}
    </Pressable>

    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      onSend={messages => onSend(messages)}
      user={{ 
          _id: CustomerId,
          name: authCtx.firstname,
          // avatar: authCtx.picture === null || "" ? <Image source={require("../assets/person-4.png")}/> : `https://phixotech.com/igoepp/public/handyman/${authCtx.picture}`
      }}

      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
    </>
  )
}

export default Chat

const styles = StyleSheet.create({
  chattxt:{
    fontSize: 18,
    color: Color.new_color,
    fontFamily: 'poppinsSemiBold',
    left: 10,
    marginTop:10,
    marginBottom:15,
  }, 
  image:{
    width: 35,
    height: 35,
    alignSelf:'center',
    marginTop: -8,
    borderRadius:50,
    borderWidth:1,
    marginRight: 5
  },
})