import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#F5FCFF",
    },
    text: {
        fontSize: height * 0.02,
        textAlign: "center",
        marginBottom: 10,
        fontFamily: "Inter-Regular",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
    },
})

export default loginStyles;