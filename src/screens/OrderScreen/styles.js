import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 35,
    paddingVertical: 10,
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
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: "#333333",
  },
  rates: {
    flexDirection: "row",
  },
  halfWidth: {
    flex: 2,
  },
  singleGoods: {
    borderTopColor: "#788eec",
    borderTopWidth: 1,
  },
  title: {
    width: "100%",
    alignContent: "center",
    textAlign: "center",
    fontSize: 22,
  },
  total: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#D0F4DE",
    alignItems: "center",
  },
  description: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  descriptionInput: {
    width: "30%",
    marginLeft: "2%",
  },
  containerAuto:{position: 'relative', height: 50},
 
  itemText: {
    fontSize: 15,
    margin: 2,
    color: 'black'
  },
  autocompleteContainer: {
    flex: 1,
    width: "100%",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
    padding: 5,
    backgroundColor: 'white'
  },
});
