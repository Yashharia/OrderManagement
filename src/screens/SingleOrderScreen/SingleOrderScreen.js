import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useFocusEffect } from "@react-navigation/native";

export default function SingleOrderScreen({ route, navigation }) {
  const single_id = route.params.id;
  const [orderData, setOrderData] = useState({});
  const [singleID, setSingleID] = useState(single_id);
  const entityRef = firebase.firestore().collection("Orders");
  const fetchData = async () => {
    entityRef
      .doc(singleID)
      .get()
      .then((collections) => {
        setOrderData(collections.data());
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        console.log(singleID, "inside focus");
        fetchData();
        return () => {};
      }, 500);
    }, [])
  );

  useEffect(() => {
    if (navigation.isFocused()) {
      fetchData(); // replace with your function
    }
  }, [navigation.isFocused()]);

  const onAddRowButtonPress = () => {
    setSingleID(single_id);
    fetchData();
  };

  if (orderData) {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="always"
        >
          <View>
            <Text>Order number:</Text>
            <Text>Order status: </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Buyer details</Text>
            <Text style={styles.normal_text}> Name: {orderData.buyerName}</Text>
            <Text style={styles.normal_text}>
              {" "}
              Address: {orderData.buyerAddress}
            </Text>
            <Text style={styles.normal_text}>
              {" "}
              Phone Number: {orderData.buyerNumber}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Consignee details</Text>
            <Text style={styles.normal_text}>
              {" "}
              Name: {orderData.consigneeName}
            </Text>
            <Text style={styles.normal_text}>
              {" "}
              Address: {orderData.consigneeAddress}
            </Text>
            <Text style={styles.normal_text}>
              {" "}
              Phone Number: {orderData.consigneeNumber}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Other details</Text>
            <Text style={styles.normal_text}>
              {" "}
              Transport: {orderData.transport}
            </Text>
            <Text style={styles.normal_text}> Broker: {orderData.broker}</Text>
          </View>
          {orderData.goods && (
            <View style={styles.formContainer}>
              <Text style={styles.heading}>Quality details</Text>
              {orderData.goods.map((data, i) => {
                return (
                  <View style={styles.row} key={i}>
                    <Text style={styles.halfWidth}> Name: {data.quality}</Text>
                    <Text style={styles.halfWidth}> Rate: {data.rate}</Text>
                    <Text style={styles.halfWidth}> Style:</Text>
                    <View style={styles.row}>
                      {data.description.map((data, j) => {
                        return (
                          <View style={styles.box}>
                            <Text style={styles.boxText}>{data}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={onAddRowButtonPress}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  } else {
    return <Text>No data</Text>;
  }
}
