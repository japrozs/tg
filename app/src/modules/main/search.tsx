import { Octicons } from "@expo/vector-icons";
import constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { layout } from "../../constants";
import { MainStackNav } from "./main-nav";

export const Search: React.FC<MainStackNav<"Search">> = () => {
    const [query, setQuery] = useState("");
    return (
        <ScrollView
            keyboardShouldPersistTaps={"handled"}
            keyboardDismissMode="on-drag"
            onScrollBeginDrag={() => Keyboard.dismiss()}
            style={{
                backgroundColor: "#000",
                paddingTop: constants.statusBarHeight + 7,
            }}
        >
            <View
                style={{
                    padding: 4,
                }}
            >
                <View
                    style={{
                        backgroundColor: layout.colors.searchBarBgColor,
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Octicons
                        name="search"
                        size={18}
                        color={"#919191"}
                        style={{
                            paddingVertical: 9,
                            paddingLeft: 10,
                        }}
                    />
                    <TextInput
                        placeholder="Search"
                        value={query}
                        onChangeText={(t) => setQuery(t)}
                        autoCorrect={false}
                        autoCapitalize={"none"}
                        placeholderTextColor={"#919191"}
                        spellCheck={false}
                        keyboardAppearance={"dark"}
                        style={{
                            marginLeft: 10,
                            color: "#fff",
                            fontSize: 17,
                            width: "87%",
                            height: "100%",
                        }}
                    />
                    {query.trim().length !== 0 ? (
                        <Octicons
                            name="x-circle-fill"
                            size={17}
                            onPress={() => {
                                setQuery("");
                                Haptics.selectionAsync();
                            }}
                            color={"#919191"}
                            style={{
                                marginLeft: "auto",
                                paddingRight: 10,
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({});
