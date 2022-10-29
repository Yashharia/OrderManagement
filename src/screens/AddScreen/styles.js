import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  },
  entityText: {
    fontSize: 20,
    color: "#333333",
  },
});
