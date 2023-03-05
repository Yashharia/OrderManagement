import React, { useEffect, useState } from "react";
import {FlatList,Text,TouchableOpacity,ScrollView,Alert,View, TextInput} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Feather } from "@expo/vector-icons";
import { NotificationClick } from "../component/Notification";
import Autocomplete from "react-native-autocomplete-input";
import { AntDesign } from '@expo/vector-icons';


export default function EditMaster({ route, navigation }) {
  var collectionname = route.params.name;

  const [entities, setEntities] = useState([]);
  const [editData, setEditData] = useState({});
  const [edit, setEdit] = useState(false);
  const [filter, setFilter] = useState('');

  const [newEditObj, setNewEditObj]= useState({});

  const [allBrokers, setAllBrokers] = useState([]);
  const [broker, setBroker] = useState("");
  const [brokerHideResult, setBrokerHideResult] = useState(true);
  let queriedBrokers =
    allBrokers && broker
      ? allBrokers.filter((item) => (item.name.toLowerCase().includes(broker.toLowerCase()))) : allBrokers;

  var entityRef = firebase.firestore().collection(collectionname);
  var orderColl = firebase.firestore().collection('Orders');
  var buyerColl = firebase.firestore().collection('Buyer');

  const fetchData = async () => {
    entityRef.get()
      .then((collections) => {
        var auto = [];
        collections.forEach((doc) => {
          var currentObj = { id: doc.id, data: doc.data() };
          auto.push(currentObj);
        });
        setEntities(auto);
      }).catch(error=> console.log(error));
  };

  const deleteDoc = (item) =>{
    Alert.alert("Are you sure you want to delete?", `This will delete ${item.data.name}`, [
        {text: "Yes", onPress: () => { entityRef.doc(item.id).delete().then(() => {fetchData(collectionname)}) },},
        {text: "No", onPress: () => { console.log("NO Pressed");}}
    ])
  }

  const fetchAll=()=>{
    firebase.firestore().collection("Broker").orderBy("name").get().then(
      data => {
        const resObj = data.docs.map((res) => res.data())
        console.log(resObj)
        setAllBrokers(resObj);
      }
    );
  }

  useEffect(() => {
    fetchAll()
    fetchData(collectionname);
    NotificationClick({ navigation });
  }, []);

  const setEditFn = (item) =>{
    // setNewName(data.name); setNewNumber(data.number); setNewAddress(data.address); setNewGST(data.gst)
    setNewEditObj(item);
    setBroker(item.broker ?? "");
  }

  function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  const editAlert = () =>{
    Alert.alert("Are you sure you want to edit?", `This will edit all the previous orders with this name`, [
      {text: "Yes", onPress: () => { updateNewData() },},
      {text: "No", onPress: () => { console.log("NO Pressed");}}
    ])
  }

  const updateNewData = () =>{

    if(collectionname != "Quality"){
      var dataVar = {};
      console.log(newEditObj,'newEditObjnewEditObj')
      Object.entries(newEditObj).forEach(([key, value]) => {
        entityRef.doc(editData.id).update(newEditObj).then(()=> {setEdit(false); fetchData()})
        if(key == "gst") key="GST"
        var fieldname = collectionname.toLowerCase() + capitalizeFirstLetter(key);
        if(fieldname == "brokerName" ||fieldname == "transportName") fieldname = collectionname.toLowerCase()
        dataVar[fieldname] = value
      });

      var findVar = collectionname.toLowerCase()+"Name";
      if(collectionname == "Broker" || collectionname == "Transport") findVar = collectionname.toLowerCase()
      orderColl.where(findVar, '==', editData.data.name).get().then((collections) => {
        collections.forEach(async (doc)  => {
          await orderColl.doc(doc.id).update(dataVar);
        })
      })
      if(collectionname == "Broker"){ //change broker name in buyer as well
        console.log("======================get buyer by broker ============")
        buyerColl.where('broker', '==', editData.data.name).get().then((collections) => {
          collections.forEach(async (doc)  => {
            var name = dataVar.broker;
            console.log(doc.id, 'buyer doc iddd ')
            await buyerColl.doc(doc.id).update({'broker': newEditObj.name});
            console.log(doc.id, 'buyer doc update ==================')
          })
        })
      }
    }else{
      var oldQualityName = editData.data.name;
      var newQualityName = newEditObj.name;
      entityRef.doc(editData.id).update(newEditObj).then(()=> {setEdit(false); fetchData()})
      orderColl.where('orderGoods','array-contains-any',[oldQualityName]).get().then((collections) => {
        collections.forEach(async (doc)  => {
          var newVals = {}
          console.log(doc.id)
          var items = doc.data().orderGoods
          var goods = doc.data().goods
          var i = items.indexOf(oldQualityName);
          items[i] = newQualityName;
          const updatedData = goods.map(x => (x.quality === oldQualityName ? { ...x, quality: newQualityName } : x));
          newVals["orderGoods"] = items
          newVals["goods"] = updatedData

          await orderColl.doc(doc.id).update(newVals);
        })
      })

    }

  }


  const updateNewDataObj = (key,value) =>{
    setNewEditObj(newEditObj => ({
      ...newEditObj,
      [key]: value,
    }));
  }


  const renderEntity = ({ item, index }) => {
    return (
      <>
        <View style={[styles.entityContainer]}>
          <View style={styles.row}>
            <View style={styles.orderDetails}>
              <TouchableOpacity onPress={() => {setEditData(item); setEdit(true); setEditFn(item.data)}}>
                <Text> {item.data.name}</Text>
              </TouchableOpacity>
            </View>
              <View style={styles.orderButtons}>
                <TouchableOpacity style={styles.singleBtn} onPress={() => deleteDoc(item)} >
                  <Feather name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </>
    );
  };

  //sort array
  var filterArr = entities.sort(function(a, b) {
    const nameA = a.data.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.data.name.toUpperCase(); // ignore upper and lowercase
    if (nameA > nameB) {
      return 1;
    }
    if (nameA < nameB) {
      return -1;
    }
  
    // names must be equal
    return 0;
  });

  if(filter != ''){
    filterArr = entities.filter(text => {
      var name = text.data.name.toUpperCase();
      return name.includes(filter.toUpperCase())
    })
  }

  return(
    <View style={styles.container}>
      <ScrollView style={{width: '100%'}}>
      {edit && (
      <View style={styles.formContainer}>
          <TextInput placeholder="Name" style={[styles.input, {marginTop: 10}]} onChangeText={(text) => {updateNewDataObj('name', text)}} value={newEditObj.name}/>
          {!(collectionname == "Transport" || collectionname == "Quality") &&
            <TextInput placeholder="Phone Number" style={[styles.input, {marginTop: 10}]} onChangeText={(text) =>{updateNewDataObj('number', text)}} keyboardType="number-pad" value={newEditObj.number}/>
          }
          {(collectionname == "Buyer" || collectionname == "Consignee") &&
            <>
              <TextInput placeholder="Address" style={[styles.input, {marginTop: 10}]} onChangeText={(text) =>{updateNewDataObj('address', text)}} value={newEditObj.address}/>
              <TextInput placeholder="GST Number" style={[styles.input, {marginTop: 10}]} onChangeText={(text) =>{updateNewDataObj('gst', text)}} value={newEditObj.gst}/>
            </>
          }
          {(collectionname == "Buyer")&&
            <>
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
                      onChangeText={(text)=>{setBroker(text.replace('.',' '));updateNewDataObj('broker', text.replace('.',' '))}}
                      onFocus={() => setBrokerHideResult(false)}
                      hideResults={brokerHideResult}
                      inputContainerStyle={styles.input} 
                      flatListProps={{
                        keyboardShouldPersistTaps: "always",
                        keyExtractor: (_, idx) => idx,
                        renderItem: ({ item, index }) => (
                          <TouchableOpacity onPress={() => { setBroker(item.name); setBrokerHideResult(true); updateNewDataObj('broker', item.name.replace('.',' '))}}>
                            <Text style={styles.itemText}>{item.name}</Text>
                          </TouchableOpacity>
                        ),
                      }}
                    />
                  </ScrollView>
                  <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setBrokerHideResult(!brokerHideResult)}/>
                </View>
              </View>
            </>
          }
            <TouchableOpacity style={styles.button} onPress={()=>{editAlert()}}>
              <Text style={styles.buttonText}>Edit {collectionname}</Text>
            </TouchableOpacity>
      </View>)}
      {(entities.length) ? (
          
        <View style={styles.listContainer}>
          <TextInput
            style={[styles.input, {width:'100%', height: 40}]}
            placeholder="Search Name"
            onChangeText={(text) => setFilter(text)}
          />
          <FlatList
            data={filterArr}
            renderItem={renderEntity}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={true}
          />
        </View>
      ): (<View><Text style={{fontSize: 25, marginTop:50}}>No results</Text></View>)}
      </ScrollView>
    </View>
  )
}
