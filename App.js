import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image, View, Text } from "react-native";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  AddScreen,
  OrderScreen,
  OrderList,
  SingleOrderScreen
} from "./src/screens";
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
    console.log("useeffect");
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
  if (loading) {
    return <></>;
  }
  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Order">
          <Drawer.Screen name="Home" component={LoginScreen} />
          <Drawer.Screen
            name="Register"
            component={RegistrationScreen}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="Consignees"
            component={AddScreen}
            initialParams={{ name: "Consignee" }}
          />
          <Drawer.Screen
            name="Buyers"
            component={AddScreen}
            initialParams={{ name: "Buyer" }}
          />
          <Drawer.Screen
            name="Brokers"
            component={AddScreen}
            initialParams={{ name: "Broker" }}
          />
          <Drawer.Screen name="Order" component={OrderScreen} />
          <Drawer.Screen name="Order List" component={OrderList} />
          <Stack.Screen name="Single order" component={SingleOrderScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
