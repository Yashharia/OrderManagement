import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,Alert,
  View, TextInput
} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Feather } from "@expo/vector-icons";
import { NotificationClick } from "../component/Notification";

export default function EditMaster({ route, navigation }) {
  var collectionname = route.params.name;

  const [entities, setEntities] = useState([]);
  const [editData, setEditData] = useState({});
  const [edit, setEdit] = useState(false);

  const [newEditObj, setNewEditObj]= useState({});

  var entityRef = firebase.firestore().collection(collectionname);
  var orderColl = firebase.firestore().collection('Orders');

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

  useEffect(() => {
    fetchData(collectionname);
    NotificationClick({ navigation });
  }, []);

  const setEditFn = (item) =>{
    // setNewName(data.name); setNewNumber(data.number); setNewAddress(data.address); setNewGST(data.gst)
    setNewEditObj(item);
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
          console.log(doc.id)
          await orderColl.doc(doc.id).update(dataVar);
        })
      })
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

  return(
    <View style={styles.container}>
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
            <TouchableOpacity style={styles.button} onPress={()=>{editAlert()}}>
              <Text style={styles.buttonText}>Edit {collectionname}</Text>
            </TouchableOpacity>
      </View>)}
      {(entities.length) ? (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={true}
          />
        </View>
      ): (<View><Text style={{fontSize: 25, marginTop:50}}>No results</Text></View>)}
    </View>
  )
}
