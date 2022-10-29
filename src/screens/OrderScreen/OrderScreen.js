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
import Autocomplete from "react-native-autocomplete-input";
import PropTypes from "prop-types";
import styles from "./styles";
import { firebase } from "../../firebase/config";

export default function OrderScreen() {
  const goodsFormat = { quality: "", rate: "", description: [""] };
  const [goods, setGoods] = useState([goodsFormat]);

  const [hideResult, setHideResult] = useState(false);
  const [allBuyers, setAllBuyers] = useState([]);
  const [allBuyersObj, setAllBuyersObj] = useState();
  const [buyerName, setBuyerName] = useState("");
  let queriedBuyers = (allBuyers && buyerName) ? allBuyers.filter(filterBuyer) : allBuyers;
  function filterBuyer(item) {
    if (item.includes(buyerName.toLowerCase())) {
      return true;
    }
  }
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerNumber, setBuyerNumber] = useState("");

  const [consigneeName, setConsigneeName] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeNumber, setConsigneeNumber] = useState("");

  const [transport, setTransport] = useState("");
  const [broker, setBroker] = useState("");

  const entityRef = firebase.firestore().collection("Orders");

  const onAddButtonPress = () => {
    if (buyerName && buyerName.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        buyerName: buyerName,
        buyerAddress: buyerAddress,
        buyerNumber: buyerNumber,
        consigneeName: consigneeName,
        consigneeAddress: consigneeAddress,
        consigneeNumber: consigneeNumber,
        transport: transport,
        broker: broker,
        goods: goods,
        createdAt: timestamp,
      };
      entityRef
        .add(data)
        .then((_doc) => {
          setGoods([goodsFormat]);
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const onAddRowButtonPress = () => {
    const abc = [...goods, goodsFormat];
    setGoods(abc);
  };

  // const calcTotal = () => {
  //   var total = 0;
  //   goods.forEach((element) => {
  //     if (element["quantity"] && element["rate"]) {
  //       var quantity = parseInt(element["quantity"]);
  //       var rate = parseInt(element["rate"]);
  //       var currenttotal = quantity * rate;
  //       total = total + currenttotal;
  //     }
  //   });
  //   setTotal(total);
  // };

  const onHandleChange = (key, value, i) => {
    const addGoods = [...goods];
    goods[i][key] = value;
    setGoods(addGoods);
  };
  const onHandleChangeDescription = (goodskey, key, value, i) => {
    const descGoods = [...goods];
    var initialArr = descGoods[goodskey][key];
    initialArr[i] = value;
    var descArr = initialArr.filter((n) => n);
    var currentLength = descArr.length;
    var lastElement = descArr[currentLength - 1];
    if (lastElement != undefined || currentLength == 1 || currentLength == 0) {
      descArr[currentLength] = "";
    }
    descGoods[goodskey][key] = descArr;
    setGoods(descGoods);
  };
  const onDeleteRow = (i) => {
    const deleteGoods = [...goods];
    deleteGoods.splice(i, 1);
    setGoods(deleteGoods);
  };

  const goodsComponent = (i) => {
    return (
      <View style={styles.singleGoods}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Quality"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => onHandleChange("quality", text, i)}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 5 }]}
            placeholder="Rate"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => onHandleChange("rate", text, i)}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            keyboardType="number-pad"
          />
        </View>
        <View>
          <Text>Description of Goods</Text>
          <View style={styles.description}>
            {goods[i].description.map((data, desc_i) => {
              return (
                <TextInput
                  key={desc_i}
                  style={[styles.input, styles.descriptionInput]}
                  onChangeText={(text) =>
                    onHandleChangeDescription(i, "description", text, desc_i)
                  }
                  keyboardType="number-pad"
                  value={data}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.rates}>
          <View style={{ paddingLeft: 7 }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#E35335" }]}
              onPress={() => onDeleteRow(i)}
            >
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const fetchAllBuyers = () => {
    firebase
      .firestore()
      .collection("Buyer")
      .get()
      .then((collections) => {
        const buyers = collections.docs.map((res) => res.data());
        const buyerNames = collections.docs.map((res) => res.data().name);
        setAllBuyers(buyerNames);
        setAllBuyersObj(buyers);
      });
  };

  useEffect(() => {
    fetchAllBuyers();
  }, []);

  function setBuyerDetails(i){
    var currentVal = allBuyersObj[i];
    console.log(currentVal)
    setBuyerName(currentVal.name);
    setBuyerNumber(currentVal.number);
    setHideResult(true)
    
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text style={styles.title}>Add Order</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.borderBottom}>Buyer Details</Text>
          <View style={styles.containerAuto}>
            <View style={styles.autocompleteContainer}>
              <Autocomplete
                autoCorrect={false}
                data={queriedBuyers}
                value={buyerName}
                onChangeText={setBuyerName}
                placeholder="Buyer name"
                hideResults={hideResult}
                flatListProps={{
                  keyboardShouldPersistTaps: "always",
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity onPress={() => setBuyerDetails(index)}>
                      <Text style={styles.itemText}>{item}{index}</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={(text) => setBuyerAddress(text)}
            value={buyerAddress}
            multiline={true}
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#aaaaaa"
            keyboardType="number-pad"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            onChangeText={(text) => setBuyerNumber(text)}
            value={buyerNumber}
          />
          <Text style={styles.borderBottom}>Consignee Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Consignee Details"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setConsigneeName(text)}
            value={consigneeName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setConsigneeAddress(text)}
            value={consigneeAddress}
            multiline={true}
            numberOfLines={4}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#aaaaaa"
            keyboardType="number-pad"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            onChangeText={(text) => setConsigneeNumber(text)}
            value={consigneeNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Transport"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setTransport(text)}
            value={transport}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Broker"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setBroker(text)}
            value={broker}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Text style={styles.borderBottom}>Quality</Text>
          {goods.map((data, i) => {
            return goodsComponent(i);
          })}
          <TouchableOpacity style={styles.button} onPress={onAddRowButtonPress}>
            <Text style={styles.buttonText}>Add Quality</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
            <Text style={styles.buttonText}>Create order</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
