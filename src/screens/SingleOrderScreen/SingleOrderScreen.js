import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, BackHandler, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";

import styles from "./styles";
import { firebase } from "../../firebase/config";
import { printPDF } from "../component/PrintPDF";
import {sendPushNotification, NavigatorClick} from '../component/Notification';

export default function SingleOrderScreen({ route, navigation }) {
  const single_id = route.params.id;
  const goodsFormat = {
    quality: "",
    rate: "",
    description: [""],
    descriptionHalf: [""],
  };
  const [goods, setGoods] = useState([goodsFormat]);
  const [orderData, setOrderData] = useState({});
  const [changed, setChanged] = useState(false);
  const [orderStatus, setOrderStatus] = useState();
  const [singleID, setSingleID] = useState(single_id);
  const entityRef = firebase.firestore().collection("Orders");
  const fetchData = (id) => {
    entityRef.doc(id).get().then((collections) => {
        setOrderData(collections.data());
        setGoods(collections.data().goods);
        setOrderStatus(collections.data().orderStatus);
      });
  };

  useEffect(() => {
    fetchData(single_id);
    NavigatorClick({navigation});
  }, []);

  const goodsComponent = (i) => {
    return ( 
      <View style={styles.singleGoods} key={i}>
        <View>
        {(goods[i]["quality"]) ? (<Text style={{fontWeight: 'bold', marginVertical:5}}>Quality: {goods[i]["quality"]}</Text>) : ""}
        {(goods[i]["rate"]) ? (<Text style={{fontWeight: 'bold', marginBottom:10}}>Rate: {goods[i]["rate"]}</Text>) : ""}
          </View>
        <View>
          <Text>Design / Color Full</Text>
          <View style={styles.description}>
            {goods[i].description.map((data, desc_i) => {
              if (data.value) {
                return (
                  <TouchableOpacity style={[styles.input, styles.descriptionInput,{alignItems: "center",margin: 0,justifyContent: "center",alignContent: "center",paddingLeft: 0,}, data.status ? styles.btnactive : styles.inactive,]}
                    onPress={() => changeDescriptionStatus(i, "description", desc_i)}>
                    <Text style={{ margin: 0 }}>{data.value}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
        <View>
          <Text>Design / Color Half</Text>
          <View style={styles.description}>
            {goods[i].descriptionHalf.map((data, desc_i) => {
              if (data.value) {
                return (
                  <TouchableOpacity
                    style={[styles.input,styles.descriptionInput,{alignItems: "center",margin: 0,justifyContent: "center",alignContent: "center",paddingLeft: 0,},data.status ? styles.btnactive : styles.inactive,]}
                    onPress={() => changeDescriptionStatus(i, "descriptionHalf", desc_i)}>
                    <Text style={{ margin: 0 }}>{data.value}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      </View>
    );
  };


  function checkStatus(obj) {
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      for (let prop in item) {
        if (prop === "descriptionHalf" || prop === "description") {
          const arr = item[prop];
          for (let j = 0; j < arr.length; j++) {
            console.log(arr[j].status, arr[j].value)
            if(arr[j].status == undefined) continue
            if (!arr[j].status) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  const onAddButtonPress = () => {
    if(orderStatus === "completed" || orderStatus === "cancelled"){
      if(!checkStatus(goods)){
        Alert.alert(
          '',
          `The order has some pending qualities, are you sure you want to mark the order ${orderStatus}`, 
          [
            {text: 'OK', onPress: () => {
              entityRef.doc(single_id).update('goods', goods,'orderStatus',orderStatus).then((_doc) => { alert("Data updated"); }).catch((error) => {alert(error);});
              sendPushNotification(orderStatus,orderData,singleID);
            }
          },
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          {cancelable: false},
        );  
      }else{
        entityRef.doc(single_id).update('goods', goods,'orderStatus',orderStatus).then((_doc) => { alert("Data updated"); }).catch((error) => {alert(error);});
        sendPushNotification(orderStatus,orderData,singleID);
      }
    }else{ //run when pending
      entityRef.doc(single_id).update('goods', goods,'orderStatus',orderStatus).then((_doc) => { alert("Data updated"); }).catch((error) => {alert(error);});
    }
    setChanged(false)
  }

  const changeDescriptionStatus = (goodskey, key, i) => {
    const descGoods = [...goods];
    descGoods[goodskey][key][i]["status"] =
      !descGoods[goodskey][key][i]["status"];
    setGoods(descGoods);
    setChanged(true)
  };

  if (Object.keys(orderData).length > 0) {
    var orderDate = orderData.createdAt.toDate().toDateString();
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={{ flex: 1, width: "100%" }} keyboardShouldPersistTaps="always">
          <View style={styles.formContainer}>
            <Text style={styles.normal_text}>
              Order number: {orderData.orderID}
            </Text>
            <Text style={styles.normal_text}>
              Order status: {orderData.orderStatus}
            </Text>
            <Text style={styles.normal_text}>Date : {orderDate}</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Buyer details</Text>
            {(orderData.buyerName)? (<Text style={styles.normal_text}>Name: {orderData.buyerName}</Text>): ""}
            {orderData.buyerAddress?(<Text style={styles.normal_text}>Address: {orderData.buyerAddress}</Text>):""}
            {orderData.buyerNumber?(<Text style={styles.normal_text}>Number: {orderData.buyerNumber}</Text>):""}
            {orderData.buyerGST?(<Text style={styles.normal_text}>GST Number: {orderData.buyerGST}</Text>):""}
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Consignee details</Text>
            {orderData.consigneeName?(<Text style={styles.normal_text}>Name: {orderData.consigneeName}</Text>):""}
            {orderData.consigneeAddress?(<Text style={styles.normal_text}>Address: {orderData.consigneeAddress}</Text>):""}
            {orderData.consigneeNumber?(<Text style={styles.normal_text}>Number: {orderData.consigneeNumber}</Text>):""}
            {orderData.consigneeGST?(<Text style={styles.normal_text}>GST Number: {orderData.consigneeGST}</Text>):""}
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Other details</Text>
            {orderData.transport?(<Text style={styles.normal_text}>Transport: {orderData.transport}</Text>):""}
            {orderData.broker?(<Text style={styles.normal_text}> Broker: {orderData.broker}</Text>):""}
            {orderData.brokerNumber?(<Text style={styles.normal_text}> Broker Number: {orderData.brokerNumber}</Text>):""}
            {(orderData.brokerage != 0) && (<Text style={styles.normal_text}> Brokerage: {orderData.brokerage}</Text>)}
            {(orderData.discount != 0) && ( <Text style={styles.normal_text}> Discount: {orderData.discount}</Text>)}
          </View>
          <View style={styles.formContainer}>
            {orderData.remarks?(<Text style={styles.normal_text}>Remarks: {orderData.remarks}</Text>):""}
            {orderData.totalQuantity?(<Text style={styles.normal_text}>Total Quantity: {orderData.totalQuantity}</Text>):""}
          </View>
          
          {orderData.goods && (
            <View style={styles.formContainer}>
              <Text style={styles.heading}>Quality details</Text>
              {goods.map((data, i) => {
                return goodsComponent(i);
              })}
            </View>
          )}

          <View style={styles.formContainer}>
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
            <TouchableOpacity style={styles.button} onPress={() => onAddButtonPress()}>
              <Text style={styles.buttonText}>Save order</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={() => {printPDF(single_id, orderData);}}>
            <Text style={styles.buttonText}>Print Order</Text>
          </TouchableOpacity>
            
        </KeyboardAwareScrollView>
      </View>
    );
  } else {
    return <Text>Loading...</Text>;
  }
}
