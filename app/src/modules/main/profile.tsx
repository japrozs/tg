import * as Haptics from "expo-haptics";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { layout } from "../../constants";
import { MainStackNav } from "./main-nav";
import { useMeQuery } from "../../generated/graphql";

export const Profile: React.FC<MainStackNav<"Profile">> = () => {
    const { data } = useMeQuery();
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#000", padding: 15 }}
            contentContainerStyle={{ flexGrow: 1 }}
            horizontal={false}
        >
            {/* Top row: left text column (flex:1) and right fixed image */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 20,
                }}
            >
                <Image
                    source={{
                        uri: "https://pbs.twimg.com/media/FlJwVcJXoAMvWHW.jpg",
                    }}
                    style={{
                        width: layout.images.profileImgWidth,
                        height: layout.images.profileImgHeight,
                        borderRadius: layout.images.profileImgHeight / 2,
                        borderWidth: 1,
                        borderColor: layout.colors.borderColor,
                        flexShrink: 0, // ✅ image never shrinks
                    }}
                />
                <View
                    style={{
                        flexShrink: 1,
                        flexGrow: 1,
                        marginLeft: 30,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 2,
                        }}
                    >
                        <View
                            style={{
                                marginRight: 10,
                                paddingVertical: 1.5,
                                paddingHorizontal: 6,
                                borderWidth: 0.7,
                                borderColor: layout.colors.redColor,
                                borderRadius: 7,
                                backgroundColor: layout.colors.redDarkColor,
                            }}
                        >
                            <Text
                                style={{
                                    color: layout.colors.redColor,
                                    fontWeight: "600",
                                    fontSize: 12,
                                }}
                            >
                                #{data?.me?.id}
                            </Text>
                        </View>

                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 19,
                                fontWeight: "600",
                                flexShrink: 1, // ✅ prevents name from pushing image away
                            }}
                            // numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {data?.me?.name} miller 🌟
                        </Text>
                    </View>

                    {/* <Text
                        style={{
                            color: layout.colors.secondaryColor,
                            fontSize: 16,
                            fontWeight: "500",
                            // fontFamily: "Menlo",
                            marginTop: 6,
                            marginBottom: 6,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        @{data?.me?.username}
                    </Text> */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 12,
                        }}
                    >
                        <View style={{ marginRight: 20 }}>
                            <Text style={styles.statNum}>75</Text>
                            <Text style={styles.statTitle}>Followers</Text>
                        </View>
                        <View>
                            <Text style={styles.statNum}>38</Text>
                            <Text style={styles.statTitle}>Following</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View>
                <Text style={{ flexWrap: "wrap" }}>
                    {data?.me?.bio
                        .concat("\n@tailgate")
                        .split(/(@\w+)/)
                        .map((part, index) =>
                            part.startsWith("@") ? (
                                <Text
                                    key={index}
                                    style={{
                                        color: layout.colors.redColor,
                                        fontSize: 15,
                                        fontWeight: "500",
                                    }}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                    }}
                                >
                                    {part}
                                </Text>
                            ) : (
                                <Text
                                    key={index}
                                    style={{
                                        color: "#fff",
                                        fontSize: 15,
                                    }}
                                >
                                    {part}
                                </Text>
                            )
                        )}
                </Text>
            </View>
            {/* Buttons row (kept below so it doesn't interfere with the top row) */}
            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    style={[
                        layout.styles.redButton as ViewStyle,
                        { marginLeft: 0 },
                    ]}
                    activeOpacity={0.9}
                    onPress={() => Haptics.selectionAsync()}
                >
                    <Text style={styles.buttonText}>Follow</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={layout.styles.button as ViewStyle}
                    activeOpacity={0.9}
                    onPress={() => Haptics.selectionAsync()}
                >
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const IMAGE_SIZE = layout.images.profileImgWidth || 90; // fallback to 90 if undefined
const styles = StyleSheet.create({
    buttonsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    statNum: {
        color: "white",
        fontSize: 17,
        fontWeight: 600,
    },
    statTitle: {
        color: layout.colors.secondaryColor,
        fontWeight: 600,
    },
});
