import axios from "axios"


//handyman login endpoint
async function login(email, password){
    // console.log(email,password)
    const url = 'https://phixotech.com/igoepp/public/api/igoeppauth/loginhelper'
    const response = await axios.post(url, {
            "username": email,
            "password": password,
            "application":"mobileapp"
    })
    // console.log(response.data)
    const data = response.data
    return data 
}

//handdyman signup endpoint
async function signup(lastname, firstname, email, phone, category, subcategory, password, sex, country, state, lga, address, latitude, longitude, identification_type,identification_num){
    const url = 'https://phixotech.com/igoepp/public/api/helper/store'
    const response = await axios.post(url, {
        "last_name": lastname,
        "first_name": firstname,
        "email": email,
        "phone": phone,
        "category": category,
        "subcategory": subcategory,
        "password": password,
        "sex": sex,
        "Country": country,
        "State": state,
        "lga": lga,
        "address": address,
        "address_lat": latitude,
        "address_long":longitude,
        "identification_type": identification_type,
        "identification_num":identification_num
    })
    const data = response.data
    return data;
}

//view helper by helper id endpoint
async function helperurl(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/${id}`
    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data.data
    return data
} 



//view wallet balance endpoint
async function walletbal(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/wallet/${id}`
    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
} 

//update helper wallet balance endpoint
async function updatewallet(amount, id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/walletupdate/${id}`
    const response = await axios.put(url, {
        wallet_balance: amount
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
}

//get single customer endpoint
async function getcustomer(Id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/customer/${Id}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response
    return data; 
}


//reset helper password endpoint
async function forgothelperpassword(email){
    const url = 'https://phixotech.com/igoepp/public/api/helper/forgetpassword'
    const response = await axios.post(url, {
        'email': email
    })
    const data = response.data
    return data
}

//bid request endpoint
async function bidrequest(bidId,helperId,price,reason,negotiable,token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/bidrequest`
    const response = await axios.post(url, {
        "book_id": bidId,
        "helper_id": helperId,
        "proposed_price": price,
        "reason": reason,
        "negotiable": negotiable
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
}

//view bid with bid id endpoint
async function bidrequestwithid(id, helperid, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/bidrequestviewbyhelper/${id}/${helperid}`
    const response = await axios.get(url, {
        headers:{
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//get request by request id endpoint
async function showRequestwithid (id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showrequestbyrequestid/${id}`
    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
}

//start helper request endpoint 
async function startservice(bookId, startTime, token){
    const url = 'https://phixotech.com/igoepp/public/api/auth/hrequest/starthelprequest'
    const response = await axios.post(url, {
            "book_id": bookId,
            "start_time": startTime
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data;
}

//stop helper request endpoint
async function endservice (bookId, endTime, token){
    const url = 'https://phixotech.com/igoepp/public/api/auth/hrequest/stophelprequest'
    const response = await axios.post(url, {
            "book_id": bookId,
            "stop_time": endTime
    }, {
        headers:{
            Accept:'applciation/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data;
}

//view request by catId endpoint
async function request(Id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showrequestbycatid/${Id}`

    const response = await axios.get(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    // console.log(response)
    const data = response.data
    return data;
}

async function subrequest(Id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showrequestbysubcatid/${Id}`

    const response = await axios.get(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    // console.log(response)
    const data = response.data
    return data;
}

async function requestbyhelperid(Id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showrequestbyhelperid/${Id}`

    const response = await axios.get(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    // console.log(response)
    const data = response.data
    return data;
}

//helper negotiate price endpoint
async function negotiateprice(id, price, negotiable, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/handymannegotiate/${id}`
    const response = await axios.put(url, {
        "proposed_price": price,
        "negotiable":negotiable
    }, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data
    return data
}



//accpet bid helper endpoint
async function helperAcceptBid (id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/${id}/bidrequestviewhelper`
    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data
    return data;
}

//category endpoint
async function category(){
    const url = `https://phixotech.com/igoepp/public/api/category`
    const response = await axios.get(url)
    // console.log(response)
    const data = response.data.data
    return data;

}

//view subcategory endpoint
async function subcategory(categoryId){
    const url = `https://phixotech.com/igoepp/public/api/showsubcategorybycatid/${categoryId}`
    const response = await axios.get(url)
    // console.log(response.data.data)
    const data = response.data.data
    return data;
}

async function viewsubcategory(categoryId, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/category/showsubcategory/${categoryId}`
    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    // console.log(response.data.data)
    const data = response.data
    return data;
}






//helper request sum total 
async function requestsumtotal (id, token) {
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/requestsumbyhelperid/${id}`

    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data
    return data
}


//view customer with customer Id
async function customersurl(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/${id}`
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    // console.log(response.data)
    const data = response.data.data
    return data;
} 




// chat endpoint
async function chat(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpchatview/${id}`
    const response = await axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    return response

}

//helper avaiable store endpoint
async function availablestore(id, token){
    // console.log(id, token)
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/avialhelper/${id}`
    const response = await axios.put(url, {}, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
}


//helper unavailable store endpoint
async function unavailablestore(id,token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/unavialhelper/${id}`
    const response = await axios.put(url,{}, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response.data
    return data
} 

//helper upload image/passport endpoint
async function upload(id, pictureurl, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/uploadpicture`
    const response = await axios.post(url,{
        picture: pictureurl,
        helper_id: id
    }, {
        headers:{
            "Content-Type": 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//guarantors upload details endpoint
async function guarantorsupload(guarantorsname,guarantorsemail,id,token){
    const url = `https://phixotech.com/igoepp/public/api/auth/compliance/sendtoguarantor`
    const response = await axios.post(url, {
        name: guarantorsname,
        email:guarantorsemail,
        helperid: id
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//guarantors upload ID card image endpoint
async function helperuploadIdcard(picture,id,token){
    const url = `https://phixotech.com/igoepp/public/api/auth/compliance/uploadhelperidcard`
    const response = await axios.post(url, {
        picture: picture,
        helperid:id,
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//guarantors upload ID card image endpoint
async function helperuploadAddressproof(picture,id,token){
    const url = `https://phixotech.com/igoepp/public/api/auth/compliance/uploadhelperaddressdoc`
    const response = await axios.post(url, {
        picture: picture,
        helperid:id,
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//helper update back details endpoint
async function helperbankdetails(account, accountname, id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/helper/accountupdate/${id}`
    
    const response = await axios.put(url, {
        "account": account,
        "accountname": accountname,
        "bank":"Parallex Bank",
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

// get bills category endpoint
async function helperbiller(token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getBillCategory`
    const response = await axios.get(url, {
        headers:{
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    // const data = response.data.data.categories
    const data = response.data
    return data;
}

async function helperbillerbyid(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${id}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data.data.data
    return data
}

//validate helper thirdparty phone number
async function helperthirdparty(id, phone, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/validateCustomerPhoneThirdParty`
    const response = await axios.post(url, {
        "customerID": id,
        "phoneNumber": phone,
        "type": "H"
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//validate helper self phone number
async function helperSelf(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/validateCustomerPhone`
    const response = await axios.post(url, {
        "customerID": id,
        "type": "H"
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response.data
    return data
}

// buy airtime endpoint 
async function helpervtuairtime( requestid, billerId, amount, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/vtuPaymentAirtime`
    const response = await axios.post(url, {
            "requestID": requestid,
            "billerId": billerId,
            "amount": amount
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

//buy data endpoint
async function helpervtudata(requestid, billerId, amount, bouquetCode, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/vtuPaymentData`
    const response = await axios.post(url, {
            "requestID":  requestid,
            "billerId": billerId,
            "amount": amount,
            "bouquetCode": bouquetCode
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response.data 
    return data
}

//validate internet endpoint 
async function validateinternet(id, billerId, smartCardID, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/validateCustomerInternet`
    const response = axios.post(url, {
            "customerID": id,
            "billerID": billerId,
            "type": "H",
            "smartCardID": smartCardID.toString()
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data =  response
    return data
}

//pay for internet endpoint
async function internetPayment(requestID, amount, bouquetCode, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/internetPayment`
    const response = axios.post(url, {
            "requestID": requestID,
            "amount": amount,
            "bouquetCode": bouquetCode
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data =  response
    return data
}


//vallidate bet account endpoint
async function validatebet(id, billerID, betnijaID, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/validateCustomerBet`
    const response = axios.post(url, {
            "customerID": id,
            "billerID": billerID,
            "type": "H",
            "betnijaID": betnijaID
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response
    return data
}

// make payment for bet account endpoint
async function betpay(requestID,amount,token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/betBillPayment`
    const response = axios.post(url, {
        "requestID": requestID,
        "amount": amount
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response
    return data
}

//purchase waec card endpoint
async function waeccard(id,billerID,bouquetCode,amount,token) {
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/purchaseWaecPin`
    const response = axios.post(url, {
        "customerID": id,
        "billerID": billerID,
        "type": "H",
        "bouquetCode": bouquetCode,
        "amount": amount,
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data =  response 
    return data
}

//validate customer electricity number
async function validatedisco(id, billerID, meterID, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/validateCustomerDisco`
    const response = axios.post(url, {
        "customerID": id,
        "billerID": billerID,
        "type": "H",
        "meterID": meterID
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response
    return data 
}

// customer electricity payment
async function discopayment(requestID, amount, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/discoPayment`
    const response = await axios.post(url, {
            "requestID": requestID,
            "amount": amount        
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

// validate multichoice endpoint
async function validatetv(id, billerID, smartCardID, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/validateCustomerTv`
    const response = axios.post(url, {
            "customerID": id,
            "billerID": billerID,
            "type": "H",
            "smartCardID": smartCardID
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response
    return data 
}

//multichoice payment endpoint
async function tvpay(requestID, amount, bouquetCode, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/tvPayment`
    const response = axios.post(url, {
        "requestID": requestID,
        "amount": amount,
        "bouquetCode": bouquetCode
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })

    const data = response
    return data
}

//multichoice payment for renewal endpoint
async function tvrenewalpay(requestID, amount, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/billpayment/tvPaymentRenewal`
    const response = axios.post(url, {
        "requestID": requestID,
        "amount": amount,
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const data = response 
    return data
}

async function customerrating(id, rating, ratecomment, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/customerrating`
    const response = axios.post(url, {
            "book_id": id,
            "rating": rating,
            "rating_comment": ratecomment
    }, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response 
    return data
}

//complete request endpoint
async function completerequest(book_id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/completerequest`
    const response = axios.post(url, {
        book_id: book_id,
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response
    return data
}

//complete request endpoint
async function helpercompleteproof(book_id, description, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpercompleteproof`
    const response = axios.post(url, {
        "book_id": book_id,
        "description": description,
        "picture": ""
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response
    return data
}

//get proof details using the request id
async function gethelpercompleteproofRequestId(request_id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/inquirehelperproofbyproofRequestID/${request_id}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response
    return data
}


//get proof details using the proof id
async function gethelperproofbyproofId(proof_id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/inquirehelperproofbyproofid/${proof_id}`
    const response = axios.post(url, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response
    return data
}

//complete request image proof
async function requestimageproof(id, picture, token){
    const url =`https://phixotech.com/igoepp/public/api/auth/hrequest/helpercompleteproofimage`
    const response = axios.post(url, {
        "proof_id": id,
        "picture": picture
    }, {
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    })
    const data = response
    return data
}

async function trendingservice(token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/fromtodayservicemarkettrend`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response
    return data
}

async function unreadhelpchat(id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/helpchatcountunread/${id}`
    const response = axios.get(url, {
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const data = response
    return data
}

async function viewcustomerratingonrequest (id, token){
    const url = `https://phixotech.com/igoepp/public/api/auth/hrequest/showrequestwithratingbyhelperid/${id}`
    const response = axios.get(url, {
      headers:{
        Accept: `application/json`,
        Authorization: `Bearer ${token}`
      }
    })
    const data = response
    return data
  }

  async function viewalertsetup(id,token){
    const url = `http://phixotech.com/igoepp/public/api/auth/helper/helperalertsetupview/${id}`
    const response = axios.get(url, {
        headers:{
            Accept: `application/json`,
            Authorization: `Bearer ${token}`
        }
    })

    const data = response
    return data
  }

  async function enablealert(id, event_type, alert_type, token){
    const url = `http://phixotech.com/igoepp/public/api/auth/helper/helperalertsetups`
    const response = axios.post(url,{
        helper_id: id,
        event_type: event_type,
        alert_type: alert_type
    }, {
        headers:{
            Accept:`application/json`,
            Authorization: `Bearer ${token}`
        }
    })
    const data = response
    return data
  }
  
  async function sliderimage(token){
    const url = `https://phixotech.com/igoepp/public/api/auth/general/getSlidesByApp/customer`
    const response = await axios.get(url, {
      headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  
    const data = response.data
    return data
  }





//Login
export const LoginHandyman = (email, password) => {
    return login(email, password)
}

//SignUp
export const SignUpHandyman = (lastname, firstname, email, phone, category, subcategory, password, sex, country, state, lga, address, latitude, longitude,identification_type,identification_num) => {
    return signup(lastname, firstname, email, phone, category, subcategory, password, sex, country, state, lga, address, latitude, longitude,identification_type,identification_num)
}

//Forgot password
export const ForgotHelperPassword = (email) => {
    return forgothelperpassword(email)
}

//view wallet 
export const Walletbal = (id, token)  => {
    return walletbal(id, token)
}


//update wallet 
export const UpdateWallet = (amount, id, token)  => {
    return updatewallet(amount, id, token)
}

//category
export const Category = ()  => {
    return category()
}

// Subcategory
export const SubCategory = (Id) => {
    return subcategory(Id)
}


//Start Services
export const StartService = (bookId, startTime, token) => {
    return startservice(bookId, startTime, token)
}

//End Service
export const EndService= (bookId, endtime, token) => {
    return endservice(bookId, endtime, token)
}

//Requests 
export const Request = (Id, token) => {
    return request(Id,token)
}

export const SubRequest = (Id, token) => {
    return subrequest(Id, token)
}

export const ViewSubCategory = (categoryId, token) => {
    return viewsubcategory(categoryId, token)
}


export const RequestByHelperid = (id, token) => {
    return requestbyhelperid(id, token)
}

//Get Customer
export const GetCustomer = (Id, token) => {
    return getcustomer(Id,token)
}


//Bid
export const BidRequest = (bidId,helperId,price,reason,negotiable,token) => {
    return bidrequest(bidId,helperId,price,reason,negotiable,token)
}


//view bid with bid Id
export const BidRequestWithid = (id,helperid, token) => {
    return bidrequestwithid(id,helperid, token)
}


//Accept Bid
export const HelperAcceptBid = (id, token) => {
    return helperAcceptBid(id, token)
}


//Show request with Id
export const ShowRequestWithId = (id, token) => {
    return showRequestwithid(id, token)
}


//Request Sum total
export const RequestSumTotal = (id, token) => {
    return requestsumtotal(id, token)
}

// View Customer 
export const CustomersUrl = (id, token) => {
    return customersurl(id, token)
}

//chat
export const Chat = (id, token) => {
    return chat(id, token)
}

export const UnreadHelpChat = (id, token) => {
    return unreadhelpchat(id, token)
}

//Negotiate Price
export const NegotiatePrice = (id, price, negotiable, token) => {
    return negotiateprice(id, price, negotiable, token)
}

//helper unavailable
export const UnavailableStore = (id, token) => {
    return unavailablestore(id, token)
}

//helper available
export const AvailableStore = (id, token) => {
    return availablestore(id, token)
}

//helper find
export const HelperUrl = (id, token) => {
    return helperurl(id, token)
}

//helper upload photo
export const UpLoad = (id, pictureurl, token) => {
    return upload(id,pictureurl, token)
}

//guarantors upload details
export const GuarantorsUpload = (guarantorsname, guarantorsemail, id, token) => {
    return guarantorsupload(guarantorsname, guarantorsemail, id, token)
}

//helepr upload idcard details
export const HelperUploadIdCard = (picture, id, token) => {
    return helperuploadIdcard(picture, id, token)
}


//helper upload address proof details
export const HelperUploadAddressProof = (picture, id, token) => {
    return helperuploadAddressproof(picture, id, token)
}

//helper bank details
export const HelperBankDetails = (account, accountname, id, token) => {
    return helperbankdetails(account, accountname, id, token)
}

//helper billers
export const HelperBillers = async (token) => {
    return helperbiller(token)
}

//get helper biller  by id
export const HelperBillerById = (id, token) => {
    return helperbillerbyid(id, token)
}


export const HelperThirdParty = (id, phone, token) => {
    return helperthirdparty(id, phone, token)
}

export const HelperVtuAirtime = (requestid, billerId, amount, token) => {
    return helpervtuairtime(requestid, billerId, amount, token)
}

export const HelperVtuData = (requestid, billerId, amount, bouquetCode, token) => {
    return helpervtudata(requestid, billerId, amount,bouquetCode, token)
}

export const HelperSelf = (id, token) => {
    return helperSelf(id, token)
}

export const ValidateInternet = (id, billerId, smartCardID, token) => {
    return validateinternet(id, billerId, smartCardID, token)
}

export const InternetPayment = (requestID, amount, bouquetCode, token) => {
    return internetPayment(requestID, amount, bouquetCode, token)
}

export const ValidateBet = (id, billerID, betnijaID, token) => {
    return validatebet(id, billerID, betnijaID, token)
}

export const BetPay = (requestID, amount, token) => {
    return betpay(requestID, amount, token)
}

export const WaecCard = (id,billerID,bouquetCode,amount,token) => {
    return waeccard(id,billerID,bouquetCode,amount,token)
}

export const ValidateDisco = (id, billerID, meterID, token) => {
    return validatedisco(id, billerID, meterID, token)
}

export const DiscoPayment = (requestID, amount, token) => {
    return discopayment(requestID, amount, token)
}

export const ValidateTv = (id, billerID, smartCardID, token) => {
    return validatetv(id, billerID, smartCardID, token)
}

export const TvPayment = (requestID, amount, bouquetCode, token) => {
    return tvpay(requestID, amount, bouquetCode, token)
}

export const TvRenewalPay = (requestID, amount, token) => {
    return tvrenewalpay(requestID, amount, token)
}


export const CustomerRating = (id, rating, ratecomment, token) => {
    return customerrating(id, rating, ratecomment, token)
}

export const HelperCompleteProof = (book_id, description, token) => {
    return helpercompleteproof(book_id, description, token)
}

export const GetHelperCompleteProofRequestId = (request_id, token) => {
    return gethelpercompleteproofRequestId(request_id, token)
}

export const GetHelperProofbyProofId = (proof_id, token) => {
    return gethelperproofbyproofId(proof_id, token)
}

export const RequestImageProof = (id, picture, token) => {
    return requestimageproof(id, picture, token)
}

export const TrendingService = (token) => {
    return trendingservice(token)
}

export const ViewCustomerRatingonRequest =  (id, token) => {
    return viewcustomerratingonrequest(id, token)
}

export const ViewAlertSetup = (id, token) => {
    return viewalertsetup(id, token)
}

export const EnableAlert = (id, event_type, alert_type, token) => {
    return enablealert(id, event_type, alert_type, token)
}

export const SliderImage = (token) => {
    return sliderimage(token)
}