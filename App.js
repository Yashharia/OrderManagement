import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import {AddScreen, OrderScreen,OrderList, SingleOrderScreen} from "./src/screens";
import { decode, encode } from "base-64";
import { firebase } from "./src/firebase/config";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  
  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Add New Order" backBehavior="history" >
          <Drawer.Group screenOptions={{ presentation: 'modal',  headerStyle: { backgroundColor: 'papayawhip' } }}>
            <Drawer.Screen name="Consignees" component={AddScreen} initialParams={{ name: "Consignee" }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="Buyers" component={AddScreen} initialParams={{ name: "Buyer" }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="Brokers" component={AddScreen} initialParams={{ name: "Broker" }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="Transport" component={AddScreen} initialParams={{ name: "Transport" }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
            <Drawer.Screen name="Quality" component={AddScreen} initialParams={{ name: "Quality" }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
          </Drawer.Group>
          <Drawer.Screen name="Edit Single Order" component={OrderScreen} initialParams={{ id: "", edit:false }} unmountOnBlur={true} options={{unmountOnBlur: true, drawerItemStyle: { display: "none" },}} />
          <Drawer.Screen name="Order List" component={OrderList} initialParams={{ edit: false, filter: {} }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
          <Drawer.Screen name="Add New Order" component={OrderScreen} initialParams={{ id: "", edit:false }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
          <Drawer.Screen name="Edit Order" component={OrderList} initialParams={{ edit: true, filter: {} }} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
          <Stack.Screen name="Single order" component={SingleOrderScreen} unmountOnBlur={true} options={{drawerItemStyle: { display: "none" },unmountOnBlur: true}} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
