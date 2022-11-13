import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 35,
    paddingVertical: 15,
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
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  borderBottom: {
    borderBottomColor: "#788eec",
    borderBottomWidth: 1,
    marginTop: 15,
    fontSize: 20,
  },
  heading:{
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  normal_text:{
    fontSize: 18,
  },  

  card:{ width:"100%", justifyContent:"space-between", marginBottom: 5, backgroundColor: '#C6CFF7', borderRadius: 5, padding: 10},
  row:{flexDirection:"row", flexWrap:"wrap", marginBottom:10},
  fullWidth:{width: '100%',fontSize: 18, marginBottom:5},
  box:{width:'30%', marginRight: "2%", borderColor:1, borderColor: '#000', borderWidth: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 50, marginBottom: 10},
  inactive:{backgroundColor: '#f0adc4'},
  active:{backgroundColor: '#9bebb0'},
  singleGoods: {borderTopColor: "#788eec",borderTopWidth: 1,},
  description: {flexDirection: "row",flexWrap: "wrap",marginHorizontal: "-2%",},
  descriptionInput: {width: "30%",marginLeft: "2%",},
  inactive:{backgroundColor: '#f0adc4',},
  btnactive:{backgroundColor: '#9bebb0'},
});
