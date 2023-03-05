import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, Alert, TextInput, Button } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { NotificationClick} from '../component/Notification';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function OrderList({ route, navigation }) {
  var edit = route.params.edit;
  var filter = route.params.filter;
  var erase = (route.params.erase)? true :false

  const [entities, setEntities] = useState([]);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [orderSort, setOrderSort] = useState('desc');
  const [searchID, setSearchID] = useState("");
  var entityRef = firebase.firestore().collection("Orders");

  //date start
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const[startDate, setStartDate] = useState(new Date())
  const[endDate, setEndDate] = useState(new Date())

  const handleStartDate = (date) => {
    setStartDate(date); setShowStartDatePicker(false);
  };

  const handleEndDate = (date) => {
    setEndDate(date); setShowEndDatePicker(false);
  };
  //date end

  const eraseAlert = () =>{
    Alert.alert("Are you sure you want to erase the orders?", `This will delete orders from ${dateFormated(startDate)} to ${dateFormated(endDate)}`, [{
      text: "Delete orders",
      onPress: () => {EraseOrders();},
    }, { text: "Cancel", onPress: () => { console.log("OK Pressed")}}])
  }
  const EraseOrders = async () => {
    console.log('erase', startDate, endDate)
    entityRef.where('createdAt', '>=', startDate).where('createdAt', '<=', endDate).get().then((collections) => {
      collections.forEach(async (doc)  => {
        await entityRef.doc(doc.id).delete();
      })
    })
    fetchData()
  }
  
  const fetchData = async (orderstatus = orderStatus, ordersort = orderSort) => {

    if(searchID != "") {entityRef = entityRef.where("orderID","==", parseInt(searchID))}
    if(startDate && endDate && erase){
      console.log(startDate, endDate, "onside date")
      entityRef = entityRef.where('createdAt', '>=', startDate).where('createdAt', '<=', endDate)
    }
    if(searchID == "" && !erase) {
      if(orderStatus != "all" && !erase) entityRef = entityRef.where('orderStatus', '==', orderstatus)
      entityRef = entityRef.orderBy("orderID", ordersort)
    }
    
    entityRef.get()
      .then((collections) => {
        var auto = [];
        collections.forEach((doc) => {
          var currentObj = { id: doc.id, data: doc.data() };
          auto.push(currentObj);
        });
        setEntities(auto);
        // console.log(auto)
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
    NotificationClick({navigation});
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
              <TouchableOpacity onPress={() => {
                (edit)? navigation.navigate("Edit Single Order", { id: item.id, edit: true }):
                navigation.navigate("Single order", { id: item.id })
                }}>
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

  const dateFormated = (date) => {
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  }

  const d = new Date();
  let year = d.getFullYear() - 1;

  return (
    <View style={styles.container}>

      {(erase) ? (
        <>
        <View style={[styles.row, {width: "100%", padding: 20}]}>
          <View>
            <Button title="Start Date" onPress={()=>{setShowStartDatePicker(true)}} />
            <DateTimePickerModal isVisible={showStartDatePicker} mode="date" onConfirm={handleStartDate} 
              onCancel={() =>{setShowStartDatePicker(false)}}
              maximumDate={new Date(year, 2, 1)} />
            <Text>{dateFormated(startDate)} </Text>
          </View>

          <View>
            <Button title="End Date" onPress={()=>{setShowEndDatePicker(true)}} />
            <DateTimePickerModal isVisible={showEndDatePicker} mode="date" onConfirm={handleEndDate} 
              onCancel={() =>{setShowEndDatePicker(false)}}
              maximumDate={new Date(year, 2, 1)}
              minimumDate={startDate} />
            <Text> {dateFormated(endDate)}</Text>
          </View>
        </View>
        <View style={[styles.row, {width: "100%", padding: 20}]}>
          <TouchableOpacity style={styles.button} onPress={() => {fetchData()}}>
            <Text style={styles.buttonText}>Filter orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'red'} ]} onPress={() => {eraseAlert()}}>
            <Text style={styles.buttonText}>Erase orders</Text>
          </TouchableOpacity>
        </View>
      </>
      ): (
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop:10}}>
        <View style={styles.row}>
          <Picker style={[{ backgroundColor: "#fff"}, styles.flexOne]} selectedValue={orderStatus} onValueChange={(itemValue, itemIndex) => {
              setOrderStatus(itemValue);
            }
            }>
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Cancelled" value="cancelled" />
            <Picker.Item label="All" value="all" />
          </Picker>
          <Picker style={[{ backgroundColor: "#fff", marginLeft: 5}, styles.flexOne]} selectedValue={orderSort} onValueChange={(itemValue, itemIndex) => {
              setOrderSort(itemValue);}}>
            <Picker.Item label="DESC" value="desc" />
            <Picker.Item label="ASC" value="asc" />
          </Picker>
          <TouchableOpacity style={[styles.button, {maxWidth: 40, paddingHorizontal:0} ]} onPress={() => fetchData(orderStatus, orderSort)}>
              <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.row, {borderTopWidth: 0.5, marginTop:5}]}>
          <TextInput style={[styles.input, styles.flexOne]} placeholder="Order number" value={searchID} onChangeText={(text) => setSearchID(text)} keyboardType="number-pad"/>
          <TouchableOpacity style={[styles.button, styles.flexOne ]} onPress={() => fetchData()}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>)}
      
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
