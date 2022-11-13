import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Alert, TextInput } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";
// import {AddOrderBtn} from "./component/AddOrderBtn";
import { Picker } from "@react-native-picker/picker";


export default function OrderList({ route, navigation }) {
  var edit = route.params.edit;
  var filter = route.params.filter;

  const [entities, setEntities] = useState([]);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [searchID, setSearchID] = useState("");
  var entityRef = firebase.firestore().collection("Orders");
  
  
  const fetchData = async (orderstatus = "pending") => {
    if(searchID != "") {console.log('search',searchID, orderStatus);entityRef = entityRef.where("orderID","==", parseInt(searchID))}
    if(searchID == "") entityRef = entityRef.where('orderStatus', '==', orderstatus)
    entityRef = entityRef.orderBy("createdAt", "desc")
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

  let deleteDoc = async (id) => {
    Alert.alert("Cancel order?", "", [
      {
        text: "Cancel",
        onPress: () => {
          return;
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const res = await entityRef.doc(id).update('orderStatus','cancelled');
          fetchData();
        },
      },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop:10}}>
        <Text style={{marginBottom: 5}}>Order status</Text>
        <Picker style={{ backgroundColor: "#fff"}} selectedValue={orderStatus} onValueChange={(itemValue, itemIndex) => {
            setOrderStatus(itemValue); fetchData(itemValue);
          }
          }>
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Completed" value="completed" />
          <Picker.Item label="Cancelled" value="cancelled" />
        </Picker>
        <TextInput style={[styles.input]} placeholder="Search by order number" value={searchID} onChangeText={(text) => setSearchID(text)} keyboardType="number-pad"/>
        <TouchableOpacity style={styles.button} onPress={() => fetchData()}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {entities && (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={true}
          />
        </View>
      )}
    </View>
  );
}
