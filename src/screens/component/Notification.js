import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
const notificationDB = firebase.firestore().collection("Notification");
import { firebase } from "../../firebase/config";
async function sendPushNotification(type, data, single_id) {
  notificationDB
    .get()
    .then((collections) => {
      collections.forEach(async function (doc) {
        const message = {
          to: doc.id,
          sound: "default",
          title: type + " - " + data.buyerName + " - " + data.orderID,
          data: { orderID: single_id },
        };
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
        console.log("send notification");
      });
    })
    .catch((error) => console.log(error));
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    notificationDB
      .doc(token)
      .get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists)
          notificationDB.doc(token).set({ token: token });
      });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}


function NotificationClick({navigation}) {
    Notifications.addNotificationResponseReceivedListener((response) => {
      var orderID = response.notification.request.content.data;
      navigation.navigate("Single order", { id: orderID.orderID });
    });
}
function NavigatorClick({navigation}) {
  Notifications.addNotificationResponseReceivedListener((response) => {
    var orderID = response.notification.request.content.data;
    navigation.navigate("Navigator", { id: orderID.orderID });
  });
}
export { sendPushNotification, registerForPushNotificationsAsync, NotificationClick, NavigatorClick };
