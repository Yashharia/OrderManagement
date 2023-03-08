import React, { useEffect, useState } from "react";
import {FlatList,Text, TouchableOpacity, ScrollView,  View,} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Feather } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import Autocomplete from "react-native-autocomplete-input";
import { AntDesign } from '@expo/vector-icons';
import { NotificationClick} from '../component/Notification';

export default function AddScreen({ route, navigation }) {
  var collectionname = route.params.name;
  var edit = false;
  const [entities, setEntities] = useState([]);
  
  const [nameList, setNameList] = useState([]);
  const [name, setName] = useState('');
  const [nameHideResult, setNameHideResult] = useState(true);
  let queriedNameList = nameList && name ? nameList.filter((item) => {if (item.name.toLowerCase().includes(name.toLowerCase())) return true; }) : nameList;
  
  const [quality, setQuality] = useState('');
  const [qualityList, setQualityList] = useState([]);
  const [qualityHideResult, setQualityHideResult] = useState(true);
  let queriedQualityList = qualityList && quality ? qualityList.filter((item) => {if (item.name.toLowerCase().includes(quality.toLowerCase())) return true; }) : qualityList;
  
  const [orderStatus, setOrderStatus] = useState('');

  const entityRef = firebase.firestore().collection(collectionname);
  const qualityRef = firebase.firestore().collection('Quality');
  var orders = firebase.firestore().collection('Orders');
  const fetchData = async () => {
    entityRef.orderBy('name').get().then((collections) => {
        var auto = [];
        collections.forEach((doc) => { var currentObj = { id: doc.id, name: doc.data().name }; auto.push(currentObj); });
        setNameList(auto);
      });
      if(collectionname != "Transport" && collectionname != "Quality"){
        qualityRef.orderBy('name').get().then((collections) => {
          var auto = [];
          collections.forEach((doc) => { var currentObj = { id: doc.id, name: doc.data().name }; auto.push(currentObj); });
          setQualityList(auto);
        });
      }
  };

  
  const filterShow = async () => {
    var auto = [];
    if(name != "") {
      if(collectionname == "Buyer")orders = orders.where('buyerName','==',name)
      if(collectionname == "Consignee")orders = orders.where('consigneeName','==',name)
      if(collectionname == "Broker")orders = orders.where('broker','==',name)
      if(collectionname == "Transport")orders = orders.where('transport','==',name)
      if(collectionname == "Quality")orders = orders.where('orderGoods','array-contains-any',[name])
    }
    if(quality != "") orders = orders.where('orderGoods','array-contains-any',[quality])
    if(orderStatus != "") orders = orders.where('orderStatus','==',orderStatus)
    orders = orders.orderBy("createdAt", "desc")
    orders.get().then((collections) => {
      collections.forEach((doc) => {
        var currentObj = { id: doc.id, data: doc.data() };
        auto.push(currentObj);
      });
      setEntities(auto);
      if(collectionname == "Quality" && name != "" && orderStatus == "pending"){
        var filterArr = auto.filter(item => { // filter only if the quality is pending
          var data = item['data']
          var getCurrentQualityData = data['goods'].filter(singleQuality => singleQuality.quality == name)
          if(getCurrentQualityData[0] != undefined){
            console.log(getCurrentQualityData, 'getCurrentQualityData')
            var description = getCurrentQualityData[0].description.map(single=> single.status)
            var descriptionHalf = getCurrentQualityData[0].descriptionHalf.map(single=>single.status)
            var finalArr = [...description, ...descriptionHalf]
            console.log(finalArr.includes(false), 'finalarr')
            return finalArr.includes(false)
          }else{return false;}
        })
        setEntities(filterArr);
      }
    })
  };

  useEffect(() => {
    fetchData();
    NotificationClick({navigation});
    if(collectionname == 'Quality') setOrderStatus('pending')
  }, []);

 
  let deleteDoc = async(id) => {
    Alert.alert("Cancel order?", "", [{text: "Cancel", onPress: () => {return;},style: "cancel",},
      {
        text: "OK", onPress: async () => {
          await entityRef.doc(id).update('orderStatus', 'cancelled');
          fetchData();
        },
      },
    ]);
  }

  const renderEntity = ({ item, index }) => {
    var singleid = item.id;
    var dateUnformated = item.data.createdAt.toDate();
    var date = dateUnformated.getDate() +'-'+(dateUnformated.getMonth()+1)+'-'+dateUnformated.getFullYear();
    return (
      <>
        <View
          style={[
            styles.entityContainer,
            item.data.orderStatus == "completed"
              ? styles.completed
              : styles.pending,
            item.data.orderStatus == "cancelled"
              ? { backgroundColor: "#575ceb" }
              : "",
          ]}
        >
          <View style={styles.row}>
            <View style={styles.orderDetails}>
              <TouchableOpacity onPress={() => navigation.navigate("Single order", { id: item.id, showEdit: edit })}>
                <Text>{item.data.orderID} - {date} - {item.data.buyerName} - {item.data.orderStatus}</Text>
              </TouchableOpacity>
            </View>
            {edit && (
              <View style={styles.orderButtons}>
                <TouchableOpacity style={styles.singleBtn} onPress={() => deleteDoc(item.id)} >
                  <Feather name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </>
    );
  };

  return (
    <>
    <View style={[styles.formContainer, {zIndex: 9}]}>
       
          <View style={[styles.containerAuto,  !nameHideResult && queriedNameList.length > 0 ? styles.active : "",]}>
            <View style={[styles.autocompleteContainer]}>
                <Autocomplete 
                placeholder="Name" autoCorrect={false}
                  data={queriedNameList} value={name} onChangeText={(text)=>{setName(text);}}
                  onFocus={() => setNameHideResult(false)} hideResults={nameHideResult}
                  inputContainerStyle={[styles.input]} 
                  listContainerStyle={{height: 150, paddingBottom: 50, zIndex: 99}}
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity onPress={() => {setName(item.name); setNameHideResult(true)}}>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}/>
            </View>
            <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setNameHideResult(!nameHideResult)}/>
          </View>
      
      
        {qualityList.length > 0 &&(
          <View style={[styles.containerAuto, !qualityHideResult && queriedQualityList.length > 0 ? styles.active : "", {marginLeft: 5}]}>
              <View style={[styles.autocompleteContainer]}>
                <Autocomplete placeholder="Quality" autoCorrect={false}
                  data={queriedQualityList} value={quality} onChangeText={(text)=>{setQuality(text);}}
                  onFocus={() => setQualityHideResult(false)} hideResults={qualityHideResult}
                  inputContainerStyle={styles.input} 
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity onPress={() => {setQuality(item.name); setQualityHideResult(true)}}>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}/>
              </View>
              <AntDesign name="caretdown" size={18} color="black" style={styles.uparrow}  onPress={()=>setQualityHideResult(!qualityHideResult)}/>
          </View>
        )}
      </View>

      <View style={styles.formContainer}>          
        <View style={styles.halfWidth}>
          <Picker style={{ backgroundColor: "#fff" }} selectedValue={orderStatus} onValueChange={(itemValue, itemIndex) => setOrderStatus(itemValue)}>
            <Picker.Item label="All" value="" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Cancelled" value="cancelled" />
          </Picker>
        </View>
        <View style={styles.halfWidth}>
          <TouchableOpacity style={styles.button} onPress={() => filterShow()}>
            <Text style={styles.buttonText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {(entities.length>0)?(
        <View style={styles.listContainer}>
          <Text>{collectionname} Order List</Text>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={true}
          />
        </View>
      ) : (<View style={styles.listContainer}><Text>No result</Text></View>)}
    </>
  );
}
