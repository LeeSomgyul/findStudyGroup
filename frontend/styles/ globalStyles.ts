import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    button: {
        width: "80%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#007bff",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default globalStyles;