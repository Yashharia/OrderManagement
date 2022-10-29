import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import {SingleOrderScreen} from "../../../src/screens";
export default function OrderList({ navigation }) {
  const [entities, setEntities] = useState([]);
  const entityRef = firebase.firestore().collection("Orders");
  
  const fetchData = async () => {
    entityRef
      .orderBy("createdAt", "desc")
      .get()
      .then((collections) => {
        var auto = [];
        collections.forEach((doc) => {
          var currentObj = { id: doc.id, data: doc.data() };
          auto.push(currentObj);
        });
        setEntities(auto);
      });
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const renderEntity = ({ item, index }) => {
    var singleid = item.id;
    return (
      <>
        <View style={styles.entityContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Single order", { id: item.id })}
          >
            <Text style={styles.entityText}>{item.data.buyerName}</Text>
            <Text>{item.data.buyerNumber}</Text>
            <Text>{singleid}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
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
