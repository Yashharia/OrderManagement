import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Autocomplete from "react-native-autocomplete-input";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { ScrollView } from "react-native-gesture-handler";
import { printPDF } from "../component/PrintPDF";
import { Picker } from "@react-native-picker/picker";

export default function OrderScreen({ route, navigation }) {
  var single_id = route.params.id;
  var edit = route.params.edit;
  var allCollectionList = ["Buyer", "Consignee", "Transport", "Broker", "Quality"];
  const [orderStatus, setOrderStatus] = useState("pending");
  const goodsFormat = {
    quality: "",
    rate: "",
    description: [""],
    descriptionHalf: [""],
  };
  const [goods, setGoods] = useState([goodsFormat]);
  const [goodsInOrder, setGoodsInOrder] = useState([]);

  // date start
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  // date end

  const [orderID, setOrderID] = useState("");

  // BUYER DATA start
  const [allBuyers, setAllBuyers] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  let queriedBuyers =
    allBuyers && buyerName
      ? allBuyers.filter((item) => {
          if (item.name.toLowerCase().includes(buyerName.toLowerCase()))
            return true;
        })
      : allBuyers;
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerHideResult, setBuyerHideResult] = useState(true);

  // BUYER DATA end

  // consignee DATA start
  const [consigneeName, setConsigneeName] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [allConsignee, setAllConsignee] = useState([]);
  const [consigneeHideResult, setConsigneeHideResult] = useState(true);
  let queriedConsignee =
    allConsignee && consigneeName
      ? allConsignee.filter((item) => {
          if (item.name.toLowerCase().includes(consigneeName.toLowerCase()))
            return true;
        })
      : allConsignee;
  // consignee DATA end

  const [transport, setTransport] = useState("");
  const [allTransport, setAllTransport] = useState([]);
  const [transportHideResult, setTransportHideResult] = useState(true);
  let queriedTransport =
    allTransport && transport
      ? allTransport.filter((item) => {
          if (item.name.toLowerCase().includes(transport.toLowerCase()))
            return true;
        })
      : allTransport;

  const [broker, setBroker] = useState("");
  const [allBrokers, setAllBrokers] = useState([]);
  const [brokerHideResult, setBrokerHideResult] = useState(true);
  let queriedBrokers =
    allBrokers && broker
      ? allBrokers.filter((item) => {
          if (item.name.toLowerCase().includes(broker.toLowerCase()))
            return true;
        })
      : allBrokers;

  const [quality, setQuality] = useState();
  const [allQuality, setAllQuality] = useState([]);
  const [qualityHideResult, setQualityHideResult] = useState(true);
  let queriedQuality =
    allQuality && quality
      ? allQuality.filter((item) => {
          if (item.name.toLowerCase().includes(quality.toLowerCase()))
            return true;
        })
      : allQuality;

  const entityRef = firebase.firestore().collection("Orders");
  const db = firebase.firestore();

  const checkAndCreate = (collectionName, value) => {
    if (value) {
      var existRes = db.collection(collectionName).where("name", "==", value);
      var res;
      existRes.get().then((snap) => {
        snap.forEach((doc) => {
          res = doc.data();
        });
        if (res) return true;
        const data = { name: value };
        if (collectionName == "Buyer") {
          data["address"] = buyerAddress;
        } else if (collectionName == "Consignee") {
          data["address"] = consigneeAddress;
        }
        db.collection(collectionName).add(data);
      });
    }
  };
  const createNewEntry = () => {
    const collectionArr = ["Buyer", "Consignee", "Transport", "Broker"];
    const collectionValArr = [buyerName, consigneeName, transport, broker];
    for (var i = 0; i < collectionArr.length; i++) {
      checkAndCreate(collectionArr[i], collectionValArr[i]);
    }
    for(var i = 0; i < goods.length; i++){
      checkAndCreate("Quality", goods[i].quality);
    }
  };

  const onAddButtonPress = () => {
    if (buyerName && buyerName.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      var currentOrderID = orderID;
      db.collection("orderCount").doc("y4JTEbcUbJRIx45a7WlF").get().then((collections) => {
          if(currentOrderID == "") currentOrderID = parseInt(collections.data().counter) + 1;
          console.log(currentOrderID)
          const data = {
            orderID: currentOrderID,
            buyerName: buyerName,
            buyerAddress: buyerAddress,
            consigneeName: consigneeName,
            consigneeAddress: consigneeAddress,
            transport: transport,
            broker: broker,
            goods: goods,
            orderStatus: orderStatus,
            createdAt: timestamp,
            orderGoods: goodsInOrder,
            date: dd + "/" + mm + "/" + yyyy,
          };
          if (edit) {
            entityRef.doc(single_id).update(data).then((_doc) => { 
              Alert.alert("Order created", "", [{
                text: "Download PDF",
                onPress: () => {printPDF(currentOrderID, data);},
              }, { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
             }).catch((error) => {alert(error);});
          } else {
            entityRef.add(data).then((_doc) => {
                db.collection("orderCount").doc("y4JTEbcUbJRIx45a7WlF").update({
                    counter: firebase.firestore.FieldValue.increment(1),
                  });
                createNewEntry();
                Alert.alert("Order created", "", [{
                    text: "Download PDF",
                    onPress: () => {printPDF(_doc.id, data);},
                  }, { text: "OK", onPress: () => {console.log("OK Pressed"); fetchAll(allCollectionList)} },
                ]);
                setGoods([goodsFormat]);
                setBuyerName(""); setBuyerAddress(""); setBuyerHideResult(true);

                setConsigneeName(""); setConsigneeAddress(""); setConsigneeHideResult(true);

                setTransport(""); setTransportHideResult(true);
                setBroker(""); setBrokerHideResult(true);

                Keyboard.dismiss();
              })
              .catch((error) => {
                alert(error);
              });
          }
        });
    }
  };
  
  
  const onHandleChange = (key, value, i) => {
    const addGoods = [...goods];
    const currOrderGoods = [...goodsInOrder];
    goods[i][key] = value;

    if(key == "quality") currOrderGoods[i] = value;
    setGoods(addGoods);
    setGoodsInOrder(currOrderGoods);
  };
  const onHandleChangeDescription = (goodskey, key, value, i) => {
    const descGoods = [...goods];
    var initialArr = descGoods[goodskey][key];
    initialArr[i] = { value: value, status: false };
    var descArr = initialArr.filter((n) => n);
    var currentLength = descArr.length;
    var lastElement = descArr[currentLength - 1];
    if (lastElement != undefined || currentLength == 1 || currentLength == 0) {
      descArr[currentLength] = "";
    }
    descGoods[goodskey][key] = descArr;
    setGoods(descGoods);
  };

  const onAddRowButtonPress = () => {
    const abc = [...goods, goodsFormat];
    setGoods(abc);
  };
  const onDeleteRow = (i) => {
    const deleteGoods = [...goods];
    deleteGoods.splice(i, 1);
    setGoods(deleteGoods);
  };

  const goodsComponent = (i) => {
    return (
      <View style={styles.singleGoods} key={i}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <View style={{ zIndex: 6, flex: 1, height: 58 }}>
            <ScrollView
                  style={[
                    (!qualityHideResult && {height: 98}),
                    styles.autocompleteContainer, 
                    !consigneeHideResult && queriedConsignee.length > 0 ? styles.active: "",
                  ]} >
              <Autocomplete
                  inputContainerStyle={styles.input}
                  placeholder="Quality" autoCorrect={false} data={queriedQuality} value={goods[i]["quality"]} 
                  onChangeText={(text) => {onHandleChange("quality", text, i), setQuality(text)}}
                  onFocus={() => {setQualityHideResult(false)}} hideResults={qualityHideResult} 
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          onHandleChange("quality", item.name, i)
                          setQualityHideResult(true);
                        }}
                      >
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
          </ScrollView>
        </View>
          <TextInput
            style={[styles.input, {width:'100%', flex: 1, marginLeft: 5 }]}
            placeholder="Rate"
            onFocus={() => setQualityHideResult(true)}
            onChangeText={(text) => onHandleChange("rate", text, i)}
            keyboardType="number-pad"
            value={goods[i]["rate"]}
          />
        </View>
        <View>
          <Text>Design / Color Full</Text>
          <View style={styles.description}>
            {goods[i].description.map((data, desc_i) => {
                return (
                  <TextInput
                    key={desc_i}
                    onFocus={() => setQualityHideResult(true)}
                    style={[styles.input, styles.descriptionInput]}
                    onChangeText={(text) =>
                      onHandleChangeDescription(i, "description", text, desc_i)
                    }
                    keyboardType="number-pad"
                    value={data.value}
                  />
                );
            })}
          </View>
        </View>
        <View>
          <Text>Design / Color Half</Text>
          <View style={styles.description}>
            {goods[i].descriptionHalf.map((data, desc_i) => {
                return (
                  <TextInput
                    onFocus={() => setQualityHideResult(true)}
                    key={desc_i}
                    style={[styles.input, styles.descriptionInput]}
                    onChangeText={(text) =>
                      onHandleChangeDescription(
                        i,
                        "descriptionHalf",
                        text,
                        desc_i
                      )
                    }
                    keyboardType="number-pad"
                    value={data.value}
                  />
                );
            })}
          </View>
        </View>
        <View style={styles.rates}>
          <View style={{ paddingLeft: 7 }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#E35335" }]}
              onPress={() => onDeleteRow(i)} >
              <Text style={styles.buttonText}>Delete quality</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  var firebaseDB = firebase.firestore();
  function doWork(text, data) {
    const resObj = data.docs.map((res) => res.data());
    if (text === "Buyer") setAllBuyers(resObj);
    if (text == "Consignee") setAllConsignee(resObj);
    if (text == "Transport") setAllTransport(resObj);
    if (text == "Broker") setAllBrokers(resObj);
    if (text == "Quality") {setAllQuality(resObj)};
  }
  function fetchAll(collection_list) {
    for (var i = 0; i < collection_list.length; i++) {
      firebaseDB
        .collection(collection_list[i])
        .orderBy("name")
        .get()
        .then(doWork.bind(null, collection_list[i]));
    }
  }

  const fetchEditDoc = (id) => {
    entityRef
      .doc(id)
      .get()
      .then((collections) => {
        var orderData = collections.data();
        setOrderStatus(orderData.orderStatus);
        setBuyerName(orderData.buyerName);
        setBuyerAddress(orderData.buyerAddress);
        setConsigneeName(orderData.consigneeName);
        setConsigneeAddress(orderData.consigneeAddress);
        setTransport(orderData.transport);
        setBroker(orderData.broker);
        setGoods(orderData.goods);
        setOrderID(orderData.orderID);
      });
  };

  useEffect(() => {
    fetchAll(allCollectionList);
    if (single_id) fetchEditDoc(single_id);
  }, []);

  function setBuyerDetails(i) {
    var currentVal = allBuyers[i];
    setBuyerName(currentVal.name);
    setBuyerAddress(currentVal.address);
    setBuyerHideResult(true);
  }

  function setConsigneeDetails(i) {
    var currentVal = allConsignee[i];
    setConsigneeName(currentVal.name);
    setConsigneeAddress(currentVal.address);
    setConsigneeHideResult(true);
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Text style={styles.title}>{edit ? "Edit" : "Add"} Order</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.borderBottom}>Buyer Details</Text>
          <View style={styles.containerAuto}>
            <ScrollView
              style={[
                styles.autocompleteContainer,
                !buyerHideResult && queriedBuyers.length > 0
                  ? styles.active
                  : "",
              ]}
            >
              <Autocomplete
                placeholder="Buyer name"
                autoCorrect={false}
                data={queriedBuyers}
                value={buyerName}
                onChangeText={setBuyerName}
                onFocus={() => setBuyerHideResult(false)}
                hideResults={buyerHideResult}
                inputContainerStyle={styles.input}
                flatListProps={{
                  keyboardShouldPersistTaps: "always",
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity onPress={() => setBuyerDetails(index)}>
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </ScrollView>
          </View>
          <TextInput
            placeholder="Address"
            style={styles.input}
            onChangeText={(text) => setBuyerAddress(text)}
            value={buyerAddress}
            multiline={true}
            numberOfLines={4}
          />

          <Text style={styles.borderBottom}>Consignee Details</Text>

          <View style={styles.containerAuto}>
            <ScrollView
              style={[
                styles.autocompleteContainer,
                !consigneeHideResult && queriedConsignee.length > 0
                  ? styles.active
                  : "",
              ]}
            >
              <Autocomplete
                placeholder="Consignee name"
                autoCorrect={false}
                data={queriedConsignee}
                value={consigneeName}
                onChangeText={setConsigneeName}
                onFocus={() => setConsigneeHideResult(false)}
                hideResults={consigneeHideResult}
                inputContainerStyle={styles.input}
                flatListProps={{
                  keyboardShouldPersistTaps: "always",
                  keyExtractor: (_, idx) => idx,
                  renderItem: ({ item, index }) => (
                    <TouchableOpacity onPress={() => setConsigneeDetails(index)} >
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </ScrollView>
          </View>

          <TextInput
            placeholder="Address"
            style={styles.input}
            onChangeText={(text) => setConsigneeAddress(text)}
            multiline={true}
            numberOfLines={4}
            value={consigneeAddress}
          />

          <View style={{ zIndex: 7, }}>
            <View style={styles.containerAuto}>
              <ScrollView
                style={[
                  styles.autocompleteContainer,
                  !transportHideResult && queriedTransport.length > 0
                    ? styles.active
                    : "",
                ]}
              >
                <Autocomplete
                  placeholder="Transport"
                  autoCorrect={false}
                  data={queriedTransport}
                  value={transport}
                  onChangeText={setTransport}
                  onFocus={() => setTransportHideResult(false)}
                  hideResults={transportHideResult}
                  inputContainerStyle={styles.input}
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setTransport(item.name);
                          setTransportHideResult(true);
                        }}
                      >
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
              </ScrollView>
            </View>
          </View>

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
                  autoCorrect={false} data={queriedBrokers} value={broker} onChangeText={setBroker}
                  onFocus={() => setBrokerHideResult(false)} hideResults={brokerHideResult}
                  inputContainerStyle={styles.input} 
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setBroker(item.name);
                          setBrokerHideResult(true);
                        }}
                      >
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ),
                  }}
                />
              </ScrollView>
            </View>
          </View>

          <Text style={styles.borderBottom}>Quality</Text>
          {goods.map((data, i) => {
            return goodsComponent(i);
          })}

          
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onAddRowButtonPress();
              }}
            >
              <Text style={styles.buttonText}>Add Quality</Text>
            </TouchableOpacity>
         
          {edit && (
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
          )}

          <TouchableOpacity style={styles.button} onPress={() => onAddButtonPress(edit)}>
            <Text style={styles.buttonText}>Save order</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
