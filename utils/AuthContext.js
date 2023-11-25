import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useState } from 'react'
import LoadingOverlay from '../Components/Ui/LoadingOverlay'
import AsyncStorage from "@react-native-async-storage/async-storage";


export const  AuthContext = createContext({
  token:"",
  email: "",
  Id: "",
  firstname: "",
  lastname: "",
  catId: "",
  subCatId: "",
  isAuthenticated: false,
  amtvisible:'',
  balance: "",
  phone: "",
  picture:"",
  
  authenticated: (token) => {},
  helperId: (Id) => {},
  helperEmail: (email) => {},
  helperFirstName: (firstname) => {},
  helperLastName: (lastname) => {}, 
  helperCatId: (catId) => {},
  helperSubCatId: (subCatId) => {},
  helperAmtVisible: (amtvisible) => {},
  helperBalance: (balance) => {},
  helperPhone: (phone) => {},
  helperPicture: (picture) => {},
  logout: () => {}

})

function AuthContextProvider({children}){
    const [IsLogout, setIsLogout] = useState(false)
    const [authToken, setauthToken] = useState()
    const [authEmail, setauthEmail] = useState()
    const [authId, setauthId] = useState()
    const [authFirstName, setauthFirstName] = useState()
    const [authLastName, setauthLastName] = useState()
    const [authCatId, setauthCatId] = useState()
    const [authSubCatId, setauthSubCatId] = useState()
    const [authAmountVisible, setauthAmountVisible] = useState()
    const [authBalance, setauthBalance] = useState()
    const [authphone, setauthphone] = useState()
    const [authpicture, setauthpicture] = useState()


    if(IsLogout){
        return <LoadingOverlay/>
    }


    function authenticated(token){
        setauthToken(token)
        AsyncStorage.setItem('helpertoken', token)
    } 

    function helperId(id){
        const idtostring = id.toString()
        setauthId(idtostring)
        AsyncStorage.setItem('helperId', idtostring)
    }

    function helperPhone(number){
        const phonecheck = number.toString()
        setauthphone(phonecheck)
        AsyncStorage.setItem('helperPhone', phonecheck)
    }

    function helperEmail (email){
        setauthEmail(email)
        AsyncStorage.setItem('helperEmail', email)
    }

    function helperFirstName (firstname){
        setauthFirstName(firstname)
        AsyncStorage.setItem('helperFirstname', firstname)
    }

    function helperLastName (lastname){
        setauthLastName(lastname)
        AsyncStorage.setItem('helperLastname', lastname)
    }

    function helperCatId (id){
        const idtostring = id.toString()
        setauthCatId(idtostring)
        AsyncStorage.setItem('helperCatId', idtostring)
    }

    function helperSubCatId (id){
        const idtostring = id.toString()
        setauthSubCatId(idtostring)
        AsyncStorage.setItem('helperSubCatId', idtostring)
    }

    function helperAmtVisible(status){
        if(status === 'true'){
            setauthAmountVisible(status)
            AsyncStorage.setItem('helperAmtVisible', 'true')
        }else if(status === 'false'){
            setauthAmountVisible(status)
            AsyncStorage.setItem('helperAmtVisible', 'false')
        }else{
            status === ''
            setauthAmountVisible('')
            AsyncStorage.setItem('helperAmtVisible', '')
        }
    }

    function helperBalance(amount){
        console.log(amount)
        if(amount === null || '' || undefined){
            setauthBalance('0.00')
            AsyncStorage.setItem('helperBalance', '0.00')
        }else{
            const amountcheck = amount.toLocaleString()
            setauthBalance(amountcheck)
            AsyncStorage.setItem('helperBalance', amountcheck)
        }
    }

    function helperPicture (picture){
        if(picture === null || picture === undefined || picture === ""){
            setauthpicture("NoImage")
            AsyncStorage.setItem('helperPicture', 'NoImage')
        }else{
            setauthpicture(picture)
            AsyncStorage.setItem('helperPicture', picture)
        }
    }



    function logout(){
        setIsLogout(true)
        setauthToken(null)
        setauthId(null)
        setauthFirstName(null)
        setauthLastName(null)
        setauthEmail(null)
        setauthCatId(null)
        setauthSubCatId(null)
        setauthAmountVisible(null)
        setauthBalance(null)
        setauthphone(null)
        setauthpicture(null)
        AsyncStorage.removeItem('helpertoken')
        AsyncStorage.removeItem('helperId')
        AsyncStorage.removeItem('helperEmail')
        AsyncStorage.removeItem('helperFirstname')
        AsyncStorage.removeItem('helperLastname')
        AsyncStorage.removeItem('helperCatId')
        AsyncStorage.removeItem('helperSubCatId')
        AsyncStorage.removeItem('helperAmtVisible')
        AsyncStorage.removeItem('helperBalance')
        AsyncStorage.removeItem('helperPhone')
        AsyncStorage.removeItem('helperPicture')

        setIsLogout(false)
    }



    const value = {
        token: authToken,
        Id: authId,
        email: authEmail,
        firstname: authFirstName,
        lastname: authLastName,
        catId: authCatId,
        subCatId: authSubCatId,
        isAuthenticated: !!authToken,
        amtvisible: authAmountVisible,
        balance: authBalance,
        phone: authphone,
        picture: authpicture,
        authenticated:authenticated,
        helperId:helperId,
        helperEmail: helperEmail,
        helperFirstName: helperFirstName,
        helperLastName: helperLastName,
        helperCatId: helperCatId,
        helperSubCatId: helperSubCatId,
        helperAmtVisible: helperAmtVisible,
        helperBalance: helperBalance,
        helperPhone: helperPhone,
        helperPicture: helperPicture,
        logout: logout
        
    }


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider