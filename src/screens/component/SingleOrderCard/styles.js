import { StyleSheet } from "react-native";

export default StyleSheet.create({
    entityContainer: {marginTop: 16,borderBottomColor: "#cccccc",borderBottomWidth: 1,padding: 10,borderRadius: 10},
    entityText: {fontSize: 20,color: "#333333",},
    orderDetails:{flex: 1},
    completed:{backgroundColor: '#cdffc2'},
    pending:{backgroundColor: '#f0adc4'},
    row:{flexDirection: 'row', justifyContent:'space-between'},
    orderButtons:{flexDirection: 'row', width:'20%'},
    singleBtn:{justifyContent:'center', width: '50%', alignItems:'center'},
});