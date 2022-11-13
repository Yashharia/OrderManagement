import React, { useEffect, useState } from "react";
import {FlatList,Text, TouchableOpacity,   View,} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Feather } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

export default function AddScreen({ route, navigation }) {
  var collectionname = route.params.name;
  var edit = false;
  const [entities, setEntities] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [name, setName] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const entityRef = firebase.firestore().collection(collectionname);
  var orders = firebase.firestore().collection('Orders');
  const fetchData = async () => {
    entityRef.orderBy('name').get().then((collections) => {
        var auto = [];
        collections.forEach((doc) => {
          var currentObj = { id: doc.id, data: doc.data() };
          auto.push(currentObj);
        });
        setNameList(auto);
      });
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
    if(orderStatus != "") orders = orders.where('orderStatus','==',orderStatus)
    orders = orders.orderBy("createdAt", "desc")
    orders.get().then((collections) => {
      collections.forEach((doc) => {
        var currentObj = { id: doc.id, data: doc.data() };
        auto.push(currentObj);
      });
      setEntities(auto);
    })
  };

  useEffect(() => {
    fetchData();
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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.halfWidth}>
          <Text style={styles.borderBottom}>{collectionname} Name</Text>
          <Picker style={{ backgroundColor: "#fff" }} selectedValue={name} onValueChange={(itemValue, itemIndex) => setName(itemValue)}>
          {nameList.map((data) => {
            return(<Picker.Item label={data.data.name} value={data.data.name} />)
          })}
          </Picker>
        </View>
        <View style={[styles.halfWidth,{marginLeft:5}]}>
          <Text style={styles.borderBottom}>Order Status</Text>
          <Picker style={{ backgroundColor: "#fff" }} selectedValue={orderStatus} onValueChange={(itemValue, itemIndex) => setOrderStatus(itemValue)}>
            <Picker.Item label="All" value="" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Cancelled" value="cancelled" />
          </Picker>
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => filterShow()}>
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
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
    </View>
  );
}
