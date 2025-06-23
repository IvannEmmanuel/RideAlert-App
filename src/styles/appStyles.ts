import { StyleSheet } from "react-native";

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5AC2E6", // changed from #333 to blue
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#5AC2E6", // keep same as background for seamless look
    width: 300,
    height: 600,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: 30,
  },
  text: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: "#ffffff",
    marginTop: -40,
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  pressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16B0DB",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  pressText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    //fontWeight: "bold",
  },
  arrow: {
    color: "#ffffff",
    fontSize: 20,
    marginLeft: 8,
    marginTop: 1,
    fontWeight: 'bold', 
  },
});

export default appStyles;
