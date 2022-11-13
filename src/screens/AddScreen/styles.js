import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
    paddingVertical: 10,
    flexDirection: 'row'
  },
  halfWidth:{width:'50%'},
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    width: "100%",
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  listContainer: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    flex: 1,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 16,
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  entityText: {
    fontSize: 20,
    color: "#333333",
  },

  entityContainer: {marginTop: 16,borderBottomColor: "#cccccc",borderBottomWidth: 1,padding: 10,borderRadius: 10},
  entityText: {fontSize: 20,color: "#333333",},
  orderDetails:{flex: 1},
  completed:{backgroundColor: '#cdffc2'},
  pending:{backgroundColor: '#f0adc4'},
  row:{flexDirection: 'row', justifyContent:'space-between'},
  orderButtons:{flexDirection: 'row', justifyContent:'flex-end', width:'20%'},
  singleBtn:{justifyContent:'center', width: '50%', alignItems:'center'},
});
