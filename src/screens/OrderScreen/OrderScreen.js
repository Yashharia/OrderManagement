import React, { useEffect, useState } from "react";
import { FlatList,Keyboard,Text,TextInput,TouchableOpacity,View,Alert,Button} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Autocomplete from "react-native-autocomplete-input";
import styles from "./styles";
import { firebase, orderCountID } from "../../firebase/config";
import { ScrollView } from "react-native-gesture-handler";
import { printPDF } from "../component/PrintPDF";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from '@expo/vector-icons';
import {sendPushNotification, NotificationClick} from '../component/Notification';

export default function OrderScreen({ route, navigation }) {

  var single_id = route.params.id;
  var edit = route.params.edit;
  var allCollectionList = ["Buyer", "Consignee", "Transport", "Broker", "Quality"];
  const [orderStatus, setOrderStatus] = useState("pending");
  const goodsFormat = {
    quality: "",
    rate: "",
    description: [""],
    descriptionHalf: [""],
  };

  const [buttonStatus, setButtonStatus] = useState(true);

  const [goods, setGoods] = useState([goodsFormat]);
  const [goodsInOrder, setGoodsInOrder] = useState([]);

  // date start
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  // date end

  const [orderID, setOrderID] = useState("");
  const [orderDate, setOrderDate] = useState(`${ dd + "/" + mm + "/" + yyyy}`)

  // BUYER DATA start
  const [allBuyers, setAllBuyers] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  let queriedBuyers =
    allBuyers && buyerName
      ? allBuyers.filter((item) => {
          if (item.name.toLowerCase().includes(buyerName.toLowerCase()))
            return true;
        })
      : allBuyers;
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerNumber, setBuyerNumber] = useState("");
  const [buyerGST, setBuyerGST] = useState("");
  const [buyerHideResult, setBuyerHideResult] = useState(true);

  // BUYER DATA end

  // consignee DATA start
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeNumber, setConsigneeNumber] = useState("");
  const [consigneeGST, setConsigneeGST] = useState("");
  const [allConsignee, setAllConsignee] = useState([]);
  const [consigneeHideResult, setConsigneeHideResult] = useState(true);
  let queriedConsignee =
    allConsignee && consigneeName
      ? allConsignee.filter((item) => {
          if (item.name.toLowerCase().includes(consigneeName.toLowerCase()))
            return true;
        })
      : allConsignee;
  // consignee DATA end

  const [transport, setTransport] = useState("");
  const [allTransport, setAllTransport] = useState([]);
  const [transportHideResult, setTransportHideResult] = useState(true);
  let queriedTransport =
    allTransport && transport
      ? allTransport.filter((item) => {
          if (item.name.toLowerCase().includes(transport.toLowerCase()))
            return true;
        })
      : allTransport;

  const [broker, setBroker] = useState("");
  const [brokerNumber, setBrokerNumber] = useState("");
  const [brokerage, setBrokerage] = useState();
  const [allBrokers, setAllBrokers] = useState([]);
  const [brokerHideResult, setBrokerHideResult] = useState(true);
  let queriedBrokers =
    allBrokers && broker
      ? allBrokers.filter((item) => {
          if (item.name.toLowerCase().includes(broker.toLowerCase()))
            return true;
        })
      : allBrokers;

  const [quality, setQuality] = useState();
  const [allQuality, setAllQuality] = useState([]);
  const [qualityHideResult, setQualityHideResult] = useState(true);
  let queriedQuality =
    allQuality && quality
      ? allQuality.filter((item) => {
          if (item.name.toLowerCase().includes(quality.toLowerCase()))
            return true;
        })
      : allQuality;

  const [discount, setDiscount] = useState();
  const [remarks, setRemarks] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [createdAt,setCreatedAt]=useState(new Date());

  const entityRef = firebase.firestore().collection("Orders");
  const db = firebase.firestore();

  const checkAndCreate = (collectionName, value) => {
    if (value && collectionName != 'Quality') {
      var existRes = db.collection(collectionName).where("name", "==", value);
      var res;
      existRes.get().then((snap) => {
        snap.forEach((doc) => {
          res = doc.data();
        });
        if (res) return true;
        const data = { name: value };
        if (collectionName == "Buyer") {
          data["address"] = buyerAddress;
          data["number"] = buyerNumber;
          data["gst"] = buyerGST;
          data["broker"] = broker;
        } else if (collectionName == "Consignee") {
          data["address"] = consigneeAddress;
          data["number"] = consigneeNumber;
          data["gst"] = consigneeGST;
        }else if (collectionName == "Broker") {
          data["number"] = brokerNumber;
        }
        db.collection(collectionName).add(data);
      });
    }else{
      if (value){
        const data = { name: value };
        var strippedVal = value.replace(/\s/g, '').toLowerCase();
        var nameArr = allQuality.map(item => item.name.replace(/\s/g, '').toLowerCase())
        if(!nameArr.includes(strippedVal)) db.collection(collectionName).add(data);
      }
    }
  };
  
  const createNewEntry = () => {
    const collectionArr = ["Buyer", "Consignee", "Transport", "Broker"];
    const collectionValArr = [buyerName, consigneeName, transport, broker];
    for (var i = 0; i < collectionArr.length; i++) {
      checkAndCreate(collectionArr[i], collectionValArr[i]);
    }
    for(var i = 0; i < goods.length; i++){
      checkAndCreate("Quality", goods[i].quality);
    }
  };


  //on submit run this use effect
  useEffect(()=>{
    if(buttonStatus == false){
        onAddButtonPress()
    }else{
      return;
    }
  }, [buttonStatus])

  const onAddButtonPress = () => { //form submit
    if(brokerage == undefined || discount == undefined || brokerage == "" || discount == ""){
      setButtonStatus(true)
      console.log(buttonStatus)
      alert('Brokerage and discount should not be empty');
    }else{
      if (buyerName && buyerName.length > 0) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        var currentOrderID = orderID;

        db.collection("orderCount").doc(orderCountID).get().then((collections) => {
            if(currentOrderID == "") currentOrderID = parseInt(collections.data().counter) + 1;
            const data = {
              orderID: currentOrderID,
              buyerName: buyerName, buyerAddress: (buyerAddress)? buyerAddress:"", buyerNumber: (buyerNumber)? buyerNumber:"",buyerGST: (buyerGST) ? buyerGST:"",
              consigneeName: consigneeName,consigneeAddress: (consigneeAddress)? consigneeAddress: "",consigneeNumber: (consigneeNumber)? consigneeNumber : "",consigneeGST: (consigneeGST)? consigneeGST: "",
              transport: transport,broker: broker,brokerNumber: (brokerNumber) ? brokerNumber : "",
              brokerage: (brokerage)? brokerage : "",discount: (discount)? discount : "",
              goods: goods,
              remarks: (remarks)? remarks : "",totalQuantity: (totalQuantity)? totalQuantity : "",
              orderStatus: orderStatus,orderGoods: goodsInOrder, date: orderDate
            };
            if (edit) {
              data['createdAt'] = createdAt
              entityRef.doc(single_id).update(data).then((_doc) => {
                console.log(_doc, 'after update');
                createNewEntry(); 
                sendPushNotification('Order edited',data,single_id);
                Alert.alert("Order created", "", [{
                  text: "Download PDF",
                  onPress: () => {printPDF(currentOrderID, data);},
                }, { text: "OK", onPress: () => { console.log("OK Pressed"); navigation.navigate('Edit Order') }},
                setButtonStatus(true)
              ]);
              }).catch((error) => {alert(error); setButtonStatus(true)} );
            } else {
              data['createdAt'] = timestamp
              entityRef.add(data).then((_doc) => {
                console.log(_doc.id)
                  db.collection("orderCount").doc(orderCountID).update({
                      counter: firebase.firestore.FieldValue.increment(1),
                    });
                  createNewEntry();
                  sendPushNotification('New order',data, _doc.id);
                  Alert.alert("Order created", "", [{
                      text: "Download PDF",
                      onPress: () => {printPDF(_doc.id, data);},
                    }, { text: "OK", onPress: () => {console.log("OK Pressed"); fetchAll(allCollectionList)} },
                  ]);
                  setButtonStatus(true);
                  setGoods([goodsFormat]);
                  setBuyerName(""); setBuyerAddress(""); setBuyerGST(''); setBuyerNumber(''); setBuyerHideResult(true);

                  setConsigneeName(""); setConsigneeAddress(""); setConsigneeGST(''); setConsigneeNumber(''); setConsigneeHideResult(true);

                  setBrokerage(); setDiscount();
                  setRemarks(''); setTotalQuantity('');

                  setTransport(""); setTransportHideResult(true);
                  setBroker("");setBrokerNumber(""); setBrokerHideResult(true);

                  Keyboard.dismiss();
                })
                .catch((error) => {
                  alert(error);
                  setButtonStatus(true);
                });
            }
          }).catch((error) => {
            alert(error);
            setButtonStatus(true);
          });
      }else{
        alert("Buyer name cannot be empty")
        setButtonStatus(true);
      }
    }
  };
  
  
  const onHandleChange = (key, value, i) => {
    const addGoods = [...goods];
    const currOrderGoods = [...goodsInOrder];
    goods[i][key] = value;

    if(key == "quality") currOrderGoods[i] = value;
    setGoods(addGoods);
    setGoodsInOrder(currOrderGoods.map(item => item.replace(/\s/g, '').toLowerCase()));
  };
  const onHandleChangeDescription = (goodskey, key, value, i) => {
    const descGoods = [...goods];
    var initialArr = descGoods[goodskey][key];
    initialArr[i] = { value: value, status: false };
    var descArr = initialArr.filter((n) => n);
    var currentLength = descArr.length;
    var lastElement = descArr[currentLength - 1];
    if (lastElement != undefined || currentLength == 1 || currentLength == 0) {
      descArr[currentLength] = "";
    }
    descGoods[goodskey][key] = descArr;
    setGoods(descGoods);
  };

  const onAddRowButtonPress = () => {
    const abc = [...goods, goodsFormat];
    setGoods(abc);
  };
  const onDeleteRow = (i) => {
    const deleteGoods = [...goods];
    deleteGoods.splice(i, 1);
    setGoods(deleteGoods);
  };

  const goodsComponent = (i) => {
    return (
      <View style={styles.singleGoods} key={i}>
        <View style={{ flexDirection: "row"}}>
          <View style={{ zIndex: 6, flex: 1, height: 58 }}>
            <ScrollView
                  style={[
                    (!qualityHideResult && {height: 98}),
                    styles.autocompleteContainer, 
                    !consigneeHideResult && queriedConsignee.length > 0 ? styles.active: "",
                  ]} >
              <Autocomplete
                  inputContainerStyle={styles.input}
                  placeholder="Quality" autoCorrect={false} data={queriedQuality} value={goods[i]["quality"]} 
                  onChangeText={(text) => {onHandleChange("quality", text, i), setQuality(text)}}
                  onFocus={() => {setQualityHideResult(false); console.log(allQuality)}}
                  hideResults={qualityHideResult} 
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          onHandleChange("quality", item.name, i)
                          setQualityHideResult(true);
                        }}
                      >
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
          </ScrollView>
          <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setQualityHideResult(!qualityHideResult)}/>
        </View>
          <TextInput
            style={[styles.input, {width:'100%', flex: 1, marginLeft: 5 }]}
            placeholder="Rate"
            onFocus={() => setQualityHideResult(true)}
            onChangeText={(text) => onHandleChange("rate", text, i)}
            value={goods[i]["rate"]} keyboardType="number-pad"
          />
        </View>
        <View style={styles.designStyle}>
          <Text>Design / Color Full</Text>
          <View style={styles.description}>
            {goods[i].description.map((data, desc_i) => {
                return (
                  <TextInput
                    key={desc_i}
                    onFocus={() => setQualityHideResult(true)}
                    style={[styles.input, styles.descriptionInput]}
                    onChangeText={(text) =>onHandleChangeDescription(i, "description", text, desc_i)}
                    value={data.value}
                  />
                );
            })}
          </View>
        </View>
        <View style={styles.designStyle}>
          <Text>Design / Color Half</Text>
          <View style={styles.description}>
            {goods[i].descriptionHalf.map((data, desc_i) => {
                return (
                  <TextInput
                    onFocus={() => setQualityHideResult(true)}
                    key={desc_i}
                    style={[styles.input, styles.descriptionInput]}
                    onChangeText={(text) =>onHandleChangeDescription(i,"descriptionHalf",text,desc_i)}
                    value={data.value}
                  />
                );
            })}
          </View>
        </View>
        <View style={styles.rates}>
          <View style={{ paddingLeft: 7 }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#E35335" }]}
              onPress={() => onDeleteRow(i)} >
              <Text style={styles.buttonText}>Delete quality</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  var firebaseDB = firebase.firestore();
  function doWork(text, data) {
    const resObj = data.docs.map((res) => res.data());
    if (text === "Buyer") {setAllBuyers(resObj);}
    if (text == "Consignee") setAllConsignee(resObj);
    if (text == "Transport") setAllTransport(resObj);
    if (text == "Broker") setAllBrokers(resObj);
    if (text == "Quality") {setAllQuality(resObj)};
  }
  function fetchAll(collection_list) {
    for (var i = 0; i < collection_list.length; i++) {
      firebaseDB
        .collection(collection_list[i])
        .orderBy("name")
        .get()
        .then(doWork.bind(null, collection_list[i]));
    }
  }

  const fetchEditDoc = (id) => {
    entityRef
      .doc(id)
      .get()
      .then((collections) => {
        var orderData = collections.data();
        setOrderStatus(orderData.orderStatus);
        setBuyerName(orderData.buyerName);
        setBuyerAddress(orderData.buyerAddress);
        setBuyerNumber(orderData.buyerNumber);
        setBuyerGST(orderData.buyerGST);
        setConsigneeName(orderData.consigneeName);
        setConsigneeAddress(orderData.consigneeAddress);
        setConsigneeNumber(orderData.consigneeNumber);
        setConsigneeGST(orderData.consigneeGST);
        setTransport(orderData.transport);
        setBroker(orderData.broker);
        setBrokerNumber(orderData.brokerNumber);
        setBrokerage(orderData.brokerage);
        setDiscount(orderData.discount);
        setGoods(orderData.goods);
        setGoodsInOrder(orderData.orderGoods);
        setRemarks(orderData.remarks);
        setTotalQuantity(orderData.totalQuantity);
        setOrderID(orderData.orderID);
        setOrderDate(orderData.date);
        setCreatedAt(orderData.createdAt);
      });
  };

  useEffect(() => {
    fetchAll(allCollectionList);
    if (single_id) fetchEditDoc(single_id);
    NotificationClick({navigation});
  }, []);

  function setBuyerDetails(item) {
    console.log('setbuter details')
    setBuyerName(item.name);
    setBuyerAddress(item.address);
    setBuyerNumber(item.number);
    setBuyerGST(item.gst);
    setBuyerHideResult(true);
    console.log(item.broker, 'broker')
    setBroker(item.broker ?? '');
    console.log(allBrokers,'allBrokers')
    var obj = allBrokers.find(ele => ele.name === item.broker);
    if (obj != undefined) {
      const number = obj.number;
      setBrokerNumber(number ?? '');
    } 
  }

  function setConsigneeDetails(item) {
    setConsigneeName(item.name);
    setConsigneeAddress(item.address);
    setConsigneeNumber(item.number);
    setConsigneeGST(item.gst);
    setConsigneeHideResult(true);
  }



  return (

    <View style={styles.container}>
      {(!buttonStatus) && (<View style={styles.loading}><Text style={styles.loadingText}>Loading...</Text></View>)}
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text style={styles.title}>{edit ? "Edit" : "Add"} Order</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.borderBottom}>Buyer Details</Text>
          <View style={styles.containerAuto}>
            <ScrollView
              style={[
                styles.autocompleteContainer,
                !buyerHideResult && queriedBuyers.length > 0
                  ? styles.active
                  : "",
              ]}
            >
              <Autocomplete
                placeholder="Buyer name"
                autoCorrect={false}
                data={queriedBuyers}
                value={buyerName}
                onChangeText={(text)=>setBuyerName(text.replace('.'," "))}
                onFocus={() => setBuyerHideResult(false)}
                hideResults={buyerHideResult}
                inputContainerStyle={styles.input}
                flatListProps={{
                  keyboardShouldPersistTaps: "always",
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity onPress={() => setBuyerDetails(item)}>
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </ScrollView>
            <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setBuyerHideResult(!buyerHideResult)}/>
          </View>
          <TextInput
            placeholder="Address"
            style={styles.input}
            onChangeText={(text) => setBuyerAddress(text)}
            value={buyerAddress}
            multiline={true}
            numberOfLines={4}
          />
          <TextInput placeholder="Phone Number" style={[styles.input, {marginTop: 10}]} onChangeText={(text) => setBuyerNumber(text)} keyboardType="number-pad" value={buyerNumber}/>
          <TextInput placeholder="GST Number" style={[styles.input, {marginTop: 10}]} onChangeText={(text) => setBuyerGST(text)} value={buyerGST}/>

          <Text style={styles.borderBottom}>Consignee Details</Text>

          <View style={styles.containerAuto}>
            <ScrollView
              style={[
                styles.autocompleteContainer,
                !consigneeHideResult && queriedConsignee.length > 0
                  ? styles.active
                  : "",
              ]}
            >
              <Autocomplete
                placeholder="Consignee name"
                autoCorrect={false}
                data={queriedConsignee}
                value={consigneeName}
                onChangeText={(text)=>{setConsigneeName(text.replace('.', ' '))}}
                onFocus={() => setConsigneeHideResult(false)}
                hideResults={consigneeHideResult}
                inputContainerStyle={styles.input}
                flatListProps={{
                  keyboardShouldPersistTaps: "always",
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity onPress={() => setConsigneeDetails(item)} >
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </ScrollView>
            <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setConsigneeHideResult(!consigneeHideResult)}/>
          </View>

          <TextInput
            placeholder="Address"
            style={styles.input}
            onChangeText={(text) => setConsigneeAddress(text)}
            multiline={true}
            numberOfLines={4}
            value={consigneeAddress}
          />
          <TextInput placeholder="Phone Number" style={[styles.input, {marginTop: 10}]} onChangeText={(text) => setConsigneeNumber(text)} keyboardType="number-pad" value={consigneeNumber}/>
          <TextInput placeholder="GST Number" style={[styles.input, {marginTop: 10}]} onChangeText={(text) => setConsigneeGST(text)} value={consigneeGST}/>


          <View style={{ zIndex: 7, }}>
            <View style={styles.containerAuto}>
              <ScrollView
                style={[
                  styles.autocompleteContainer,
                  !transportHideResult && queriedTransport.length > 0
                    ? styles.active
                    : "",
                ]}
              >
                <Autocomplete
                  placeholder="Transport"
                  autoCorrect={false}
                  data={queriedTransport}
                  value={transport}
                  onChangeText={(text)=> {setTransport(text.replace('.', ' '))}}
                  onFocus={() => setTransportHideResult(false)}
                  hideResults={transportHideResult}
                  inputContainerStyle={styles.input}
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setTransport(item.name);
                          setTransportHideResult(true);
                        }}
                      >
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
              </ScrollView>
            <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setTransportHideResult(!transportHideResult)}/>
            </View>
          </View>

          <View>
            <View style={[styles.containerAuto, { zIndex: 6 }]}>
              <ScrollView
                style={[
                  styles.autocompleteContainer,
                  !brokerHideResult && queriedBrokers.length > 0
                    ? styles.active
                    : "",
                ]}
              >
                <Autocomplete
                  placeholder="Brokers"
                  autoCorrect={false} data={queriedBrokers} value={broker} 
                  onChangeText={(text)=>{setBroker(text.replace('.',' '))}}
                  onFocus={() => setBrokerHideResult(false)}
                  hideResults={brokerHideResult}
                  inputContainerStyle={styles.input} 
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity onPress={() => { setBroker(item.name); setBrokerNumber(item.number); setBrokerHideResult(true);}}>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
              </ScrollView>
              <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setBrokerHideResult(!brokerHideResult)}/>
            </View>
            <TextInput placeholder="Phone Number" style={[styles.input]} onChangeText={(text) => setBrokerNumber(text)} keyboardType="number-pad" value={brokerNumber}/>
          </View>

          <View style={{ flexDirection: "row", marginVertical: 20 }}>
            <TextInput placeholder="Brokerage" style={[styles.input, {flex:1}]} 
              onChangeText={(text) => setBrokerage(text)} value={brokerage} keyboardType="number-pad"/>
            <TextInput placeholder="Discount" style={[styles.input, {flex:1, marginLeft:5}]} 
              onChangeText={(text) => setDiscount(text)} value={discount} keyboardType="number-pad"/>
          </View>

          <Text style={styles.borderBottom}>Quality</Text>
          {goods.map((data, i) => {
            return goodsComponent(i);
          })}

          
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onAddRowButtonPress();
              }}
            >
              <Text style={styles.buttonText}>Add Quality</Text>
            </TouchableOpacity>
         
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <TextInput placeholder="Remarks" style={[styles.input, {flex:1}]} onChangeText={(text) => setRemarks(text)} value={remarks}/>
              <TextInput placeholder="Total quantity" style={[styles.input, {flex:1, marginLeft:5}]} onChangeText={(text) => setTotalQuantity(text)} value={totalQuantity}/>
            </View>

          {edit && (
            <View>
              <Text style={styles.borderBottom}>Order status</Text>
              <Picker
                style={{ backgroundColor: "#fff" }}
                selectedValue={orderStatus}
                onValueChange={(itemValue, itemIndex) =>
                  setOrderStatus(itemValue)
                }
              >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </Picker>
            </View>
          )}

          <TouchableOpacity style={styles.button} enabled={buttonStatus} onPress={() => {
            setButtonStatus(false);
          }}>
            <Text style={styles.buttonText}>Save order</Text>
          </TouchableOpacity>
         
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

