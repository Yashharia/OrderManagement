import "react-native-gesture-handler";
import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator,DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {AddScreen, OrderScreen,OrderList, SingleOrderScreen, Navigator, EditMaster} from "./src/screens";
import { decode, encode } from "base-64";
import * as Notifications from 'expo-notifications';
import { AntDesign } from '@expo/vector-icons';
import {registerForPushNotificationsAsync, sendPushNotification} from './src/screens/component/Notification'
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
  }),
});

const Drawer = createDrawerNavigator();

export default function App() {

  const [notification, setNotification] = useState(false);
  const [orderID, setOrderID] = useState("");
  const [reportMenu, setreportMenu] = useState(false);
  const [masterMenu, setmasterMenu] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  useEffect(() => {
    registerForPushNotificationsAsync();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      var orderID = response.notification.request.content.data
      setOrderID(orderID.orderID)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  var reports = [
    {"name": "Buyer", "route" : "Buyers"},
    {"name": "Broker", "route" : "Brokers"},
    {"name": "Consignee", "route" : "Consignees"},
    {"name": "Quality", "route" : "Quality"},
    {"name": "Transport", "route" : "Transport"},
  ]

  var editmaster = [
    {"name": "Buyer", "route" : "Edit Buyer"},
    {"name": "Broker", "route" : "Edit Broker"},
    {"name": "Consignee", "route" : "Edit Consignee"},
    {"name": "Quality", "route" : "Edit Quality"},
    {"name": "Transport", "route" : "Edit Transport"},
  ]

  function DrawerContent(props) {
    return (
      <View style={{flex: 1}}>
        <DrawerContentScrollView {...props}>
          <View style={styles.nested}>
            <TouchableOpacity style={[styles.drawerSection]} onPress={() => setreportMenu(!reportMenu)}>
              <Text style={styles.bold}>Report</Text><AntDesign name="caretdown" size={15} color="black" />
            </TouchableOpacity>
            <View style={(reportMenu)? styles.internalMenuActive : styles.internalMenu}>
              {reports.map((item) => {
                return(<TouchableOpacity style={styles.child} onPress={()=>props.navigation.navigate(item.route)}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>)
              })}
            </View>
          </View>
          <View style={[styles.nested, {borderTopWidth: 0}]}>
            <TouchableOpacity style={[styles.drawerSection]} onPress={() => setmasterMenu(!masterMenu)}>
              <Text style={styles.bold}>Master</Text><AntDesign name="caretdown" size={15} color="black" />
            </TouchableOpacity>
            <View style={(masterMenu)? styles.internalMenuActive : styles.internalMenu}>
              {editmaster.map((item) => {
                return(<TouchableOpacity style={styles.child} onPress={()=>props.navigation.navigate(item.route)}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>)
              })}
              <TouchableOpacity style={styles.drawerSection} onPress={()=>props.navigation.navigate("Erase Order")}>
                <Text>Erase Order</Text>
            </TouchableOpacity>
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.drawerSection} onPress={()=>props.navigation.navigate("Order List")}>
              <Text>Order List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerSection} onPress={()=>props.navigation.navigate("Add New Order")}>
              <Text>Add New Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerSection} onPress={()=>props.navigation.navigate("Edit Order")}>
              <Text>Edit Order</Text>
            </TouchableOpacity>
          </View>

        </DrawerContentScrollView>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer >
        <Drawer.Navigator initialRouteName={"Add New Order"} backBehavior="history" 
        drawerContent={props => <DrawerContent {...props}  />}>
            <Drawer.Screen name="Buyers" component={AddScreen} initialParams={{ name: "Buyer" }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Brokers" component={AddScreen} initialParams={{ name: "Broker" }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Consignees" component={AddScreen} initialParams={{ name: "Consignee" }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Quality" component={AddScreen} initialParams={{ name: "Quality" }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Transport" component={AddScreen} initialParams={{ name: "Transport" }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Edit Single Order" component={OrderScreen} initialParams={{ id: "", edit:false }} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Order List" component={OrderList} initialParams={{ edit: false, filter: {} }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Add New Order" component={OrderScreen} initialParams={{ id: "", edit:false }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Edit Order" component={OrderList} initialParams={{ edit: true, filter: {} }} options={{unmountOnBlur:true}} />
            <Drawer.Screen name="Single order" component={SingleOrderScreen} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Navigator" component={Navigator} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Edit Buyer" component={EditMaster} initialParams={{ name: "Buyer" }} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Edit Broker" component={EditMaster} initialParams={{ name: "Broker" }} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Edit Consignee" component={EditMaster} initialParams={{ name: "Consignee" }} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Edit Quality" component={EditMaster} initialParams={{ name: "Quality" }} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Edit Transport" component={EditMaster} initialParams={{ name: "Transport" }} options={{unmountOnBlur:true}}  />
            <Drawer.Screen name="Erase Order" component={OrderList} initialParams={{ erase: true }} options={{unmountOnBlur:true}}  />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  internalMenu:{display: "none"},
  internalMenuActive:{display: "flex"},
  nested:{borderTopColor: "#788eec", borderTopWidth: 1,  borderBottomWidth: 1,},
  bold: {fontWeight: 'bold',marginRight: 3,},
  drawerSection: {padding: 15, borderBottomColor: "#788eec", borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: "space-between"},
  child:{paddingVertical:10, paddingHorizontal:35},
});

