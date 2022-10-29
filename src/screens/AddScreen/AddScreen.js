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
export default function AddScreen({ route }) {
  var collectionname = route.params.name;
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [entities, setEntities] = useState([]);

  const entityRef = firebase.firestore().collection(collectionname);
  const fetchData = async () => {
    entityRef
      .orderBy("createdAt", "desc")
      .get()
      .then((collections) => {
        const auto = collections.docs.map((res) => res.data());
        setEntities(auto);
      });
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const onAddButtonPress = () => {
    if (name && name.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        name: name,
        number: number,
        createdAt: timestamp,
      };
      entityRef
        .add(data)
        .then((_doc) => {
          setName("");
          setNumber("");
          Keyboard.dismiss();
          fetchData();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const renderEntity = ({ item, index }) => {
    console.log(item)
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.entityText}>{item.name}</Text>
        <Text>{item.number}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Add {collectionname}</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new entity"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setName(text)}
          value={name}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={`${collectionname} number`}
          placeholderTextColor="#aaaaaa"
          keyboardType="number-pad"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={(text) => setNumber(text)}
          value={number}
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {entities && (
        <View style={styles.listContainer}>
          <Text>{collectionname} List</Text>
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
