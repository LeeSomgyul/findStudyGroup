import React from "react";
import { View, Text } from "react-native";

const Home: React.FC = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>홈</Text>
        </View>
    );
};

export default Home;