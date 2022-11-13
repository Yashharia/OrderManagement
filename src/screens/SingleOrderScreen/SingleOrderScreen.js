import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";

import styles from "./styles";
import { firebase } from "../../firebase/config";
import { printPDF } from "../component/PrintPDF";

export default function SingleOrderScreen({ route, navigation }) {
  const single_id = route.params.id;
  const showEdit = route.params.showEdit;
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
  const fetchData = () => {
    entityRef
      .doc(singleID)
      .get()
      .then((collections) => {
        setOrderData(collections.data());
        setGoods(collections.data().goods);
        setOrderStatus(collections.data().orderStatus);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goodsComponent = (i) => {
    return (
      <View style={styles.singleGoods} key={i}>
        <View>
          <Text style={{fontWeight: 'bold', marginVertical:5}}>Quality: {goods[i]["quality"]}</Text>
          <Text style={{fontWeight: 'bold', marginBottom:10}}>Rate: {goods[i]["rate"]}</Text>
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
  const onAddButtonPress = () => {
    entityRef.doc(single_id).update('goods', goods,'orderStatus',orderStatus).then((_doc) => { alert("Data updated"); }).catch((error) => {alert(error);});
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
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="always"
        >
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
            <Text style={styles.normal_text}>Name: {orderData.buyerName}</Text>
            <Text style={styles.normal_text}>
              Address: {orderData.buyerAddress}{" "}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Consignee details</Text>
            <Text style={styles.normal_text}>
              Name: {orderData.consigneeName}
            </Text>
            <Text style={styles.normal_text}>
              Address: {orderData.consigneeAddress}{" "}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Other details</Text>
            <Text style={styles.normal_text}>
              Transport: {orderData.transport}
            </Text>
            <Text style={styles.normal_text}> Broker: {orderData.broker}</Text>
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
          
          {showEdit && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate("Edit Single Order", {
                    id: single_id,
                    edit: true,
                  });
                }}
              >
                <Text style={styles.buttonText}>Edit order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  printPDF(single_id, orderData);
                }}
              >
                <Text style={styles.buttonText}>Print Order</Text>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  } else {
    return <Text>Loading...</Text>;
  }
}
