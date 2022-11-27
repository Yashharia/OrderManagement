import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {flex: 1,alignItems: "center",},
  containerAuto:{position: 'relative', marginVertical:10, height:50, width: '50%',},
  autocompleteContainer: {width: "100%",position: "absolute",},
  active:{overflow: 'scroll', backgroundColor: 'white',height:150},
  formContainer: {flexDirection: 'row', paddingHorizontal: 20},
  itemText: {fontSize: 15,padding: 4,color: 'black'},
  button: {height: 47,borderRadius: 5,backgroundColor: "#788eec",alignItems: "center",justifyContent: "center",marginLeft: 5, marginTop: 5},
  buttonText: {color: "white",fontSize: 16,},
  input: {height: 48, backgroundColor: 'white', paddingLeft: 10},
  listContainer: {width: '100%',marginTop: 20,padding: 20,flex: 1,},
  entityContainer: {
    marginTop: 16,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 16,
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  entityText: {fontSize: 20,color: "#333333",},
  entityContainer: {marginTop: 16,borderBottomColor: "#cccccc",borderBottomWidth: 1,padding: 10,borderRadius: 10},
  entityText: {fontSize: 20,color: "#333333",},
  orderDetails:{flex: 1},
  completed:{backgroundColor: '#cdffc2'},
  pending:{backgroundColor: '#f0adc4'},
  row:{flexDirection: 'row', zIndex: 0, alignItems: "center"},
  halfWidth:{width:'50%'},
  orderButtons:{flexDirection: 'row', justifyContent:'flex-end', width:'20%'},
  singleBtn:{justifyContent:'center', width: '50%', alignItems:'center'},
  uparrow:{position: "absolute", right: 10, top: 12, zIndex: 6,},
});
