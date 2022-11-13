import { FlatList, Text, TouchableOpacity, View, Alert, TextInput } from "react-native";
import styles from "./styles";

export const SingleOrderCard = ({ item, index, naviag }) => {
    var singleid = item.id;
    const editvar = false;
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
              <TouchableOpacity onPress={() => navigation.navigate("Single order", { id: item.id, showEdit: editvar })}>
                <Text>{item.data.orderID} - {date} - {item.data.buyerName} - {item.data.orderStatus}</Text>
              </TouchableOpacity>
            </View>
            {editvar && (
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