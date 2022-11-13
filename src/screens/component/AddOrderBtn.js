import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
AddOrderBtn = () => {
  const styles = StyleSheet.create({
    reloadBtn: {
      backgroundColor: "red",
      position: "absolute",
      bottom: 10,
      right: 10,
      color: "white",
      padding: 15,
    },
  });
  return (
    <TouchableOpacity onPress={() => refereshFn()} style={styles.reloadBtn}>
      <AntDesign name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default AddOrderBtn;
