import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    position:'relative',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    width: "100%",
  },
  listContainer: {
    width: "100%",
    padding: 20,
    flex: 1,
  },
 
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  entityContainer: {marginTop: 16,borderBottomColor: "#cccccc",borderBottomWidth: 1,padding: 10,borderRadius: 10},
  entityText: {fontSize: 20,color: "#333333",},
  orderDetails:{flex: 1},
  completed:{backgroundColor: '#cdffc2'},
  pending:{backgroundColor: '#f0adc4'},
  row:{flexDirection: 'row', justifyContent:'space-between'},
  orderButtons:{flexDirection: 'row', justifyContent:'flex-end', width:'20%'},
  singleBtn:{justifyContent:'center', width: '50%', alignItems:'center'},
  flexOne:{flex:1},

  formContainer: {width: "100%",paddingHorizontal: 35,paddingVertical: 10,},
});
