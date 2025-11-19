import { ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "../../ui/theme";
import { MainStackNav } from "./main-nav";

export const Notifications: React.FC<MainStackNav<"Notifications">> = () => {
    return (
        <ScrollView
            style={{
                backgroundColor: "#000",
                paddingTop: 10,
            }}
        >
            <Text
                style={{
                    fontFamily: "Menlo",
                    color: colors.primary_blue,
                }}
            >
                welcome to the fucking notifications page
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({});
