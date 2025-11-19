import { Octicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button, Image, LayoutChangeEvent, Text, View } from "react-native";
import { TAB_BAR_ICON_SIZE, layout } from "../constants";
// import { useMeQuery } from "../generated/graphql";
import { Main } from "./main/main";
import { MainStackParamList } from "./main/main-nav";
import { Notifications } from "./main/notifications";
import { Profile } from "./main/profile";
import { Search } from "./main/search";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMeQuery } from "../generated/graphql";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CreateModal } from "./main/create";
import Logo from "../../assets/icons/logo.svg";

interface MainStackProps {}

const Tab = createBottomTabNavigator<MainStackParamList>();

// TODO: move all this Tab.Screen options to another struct
//  and import it into each component

export const MainStack: React.FC<MainStackProps> = ({}) => {
    const { data } = useMeQuery();
    const insets = useSafeAreaInsets();

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const handleCreatePress = useCallback(() => {
        Haptics.selectionAsync();
        bottomSheetRef.current?.present();
    }, []);

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: {
                            backgroundColor: "#000",
                            borderTopColor: "#151A21",
                            borderTopWidth: 0.2,
                            paddingBottom: insets.bottom, // ✅ adds space for home indicator
                            paddingTop: 8, // ✅ keeps icons centered
                            height: 60 + insets.bottom, // ✅ ensures enough height
                        },
                        headerStyle: {
                            backgroundColor: "#000",
                            borderBottomColor: "#151A21",
                            borderBottomWidth: 0.2,
                        },
                        // headerBackgroundContainerStyle: {
                        //     borderBottomWidth: 1,
                        //     borderBottomColor: layout.colors.borderColor,
                        // },
                        headerShadowVisible: false,
                    }}
                    initialRouteName={"Home"}
                >
                    <Tab.Screen
                        options={{
                            headerTitle: () => (
                                <View
                                    style={{
                                        marginBottom: 10,
                                    }}
                                >
                                    <Logo width={32} height={32} />
                                </View>
                            ),
                            title: "",
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={
                                        {
                                            // paddingTop: 10,
                                        }
                                    }
                                >
                                    <Octicons
                                        name="home"
                                        size={TAB_BAR_ICON_SIZE}
                                        color={focused ? "#fff" : "#838383"}
                                    />
                                </View>
                            ),
                        }}
                        listeners={({ navigation }) => ({
                            tabPress: () => {
                                Haptics.selectionAsync();
                                navigation.navigate("Home");
                            },
                        })}
                        name="Home"
                        component={Main}
                    />
                    <Tab.Screen
                        options={{
                            headerTitle: "",
                            header: () => <></>,
                            title: "",
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={
                                        {
                                            // paddingTop: 10,
                                        }
                                    }
                                >
                                    <Octicons
                                        name="search"
                                        size={TAB_BAR_ICON_SIZE}
                                        color={focused ? "#fff" : "#838383"}
                                    />
                                </View>
                            ),
                        }}
                        listeners={({ navigation }) => ({
                            tabPress: () => {
                                Haptics.selectionAsync();
                                navigation.navigate("Search");
                            },
                        })}
                        name="Search"
                        component={Search}
                    />
                    {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
                    <Tab.Screen
                        name="Create"
                        component={() => null}
                        options={{
                            headerShown: false,
                            title: "",
                            tabBarIcon: ({ focused }) => (
                                <Octicons
                                    name="plus-circle"
                                    size={TAB_BAR_ICON_SIZE}
                                    color={focused ? "#fff" : "#838383"}
                                />
                            ),
                        }}
                        listeners={() => ({
                            tabPress: (e) => {
                                e.preventDefault(); // prevent navigation
                                handleCreatePress();
                            },
                        })}
                    />
                    <Tab.Screen
                        options={{
                            headerTitle: "Notifications",
                            headerTintColor: "#fff",
                            title: "",
                            headerBackgroundContainerStyle: {
                                borderBottomWidth: 0.8,
                                borderBottomColor: layout.colors.borderColor,
                            },
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={
                                        {
                                            // paddingTop: 10,
                                        }
                                    }
                                >
                                    <Octicons
                                        name="bell"
                                        size={TAB_BAR_ICON_SIZE}
                                        color={focused ? "#fff" : "#838383"}
                                    />
                                </View>
                            ),
                        }}
                        listeners={({ navigation }) => ({
                            tabPress: () => {
                                Haptics.selectionAsync();
                                navigation.navigate("Notifications");
                            },
                        })}
                        name="Notifications"
                        component={Notifications}
                    />
                    <Tab.Screen
                        options={{
                            headerTitle: "",
                            title: "",
                            headerBackgroundContainerStyle: {
                                borderBottomWidth: 0.8,
                                borderBottomColor: layout.colors.borderColor,
                            },
                            headerLeftContainerStyle: {
                                paddingLeft: 20,
                                paddingBottom: 6, // 👈 extra breathing room at the bottom
                            },
                            headerLeft: () => (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center", // 👈 keeps icon + text vertically aligned
                                        paddingBottom: 0, // 👈 subtle extra padding inside the row
                                    }}
                                >
                                    <Octicons
                                        name="mention"
                                        size={TAB_BAR_ICON_SIZE - 4}
                                        color={layout.colors.secondaryColor}
                                    />
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 20.5,
                                            fontWeight: "600",
                                            marginLeft: 6, // 👈 consistent spacing between icon and text
                                        }}
                                    >
                                        {data?.me?.username}
                                    </Text>
                                </View>
                            ),
                            headerRight: () => (
                                <>
                                    <Octicons
                                        style={{
                                            marginRight: 15,
                                        }}
                                        name="three-bars"
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                        }}
                                        size={TAB_BAR_ICON_SIZE - 2}
                                        color="#fff"
                                    />
                                    {/* <Modal
                                animationType="slide"
                                transparent={true}
                                visible={open}
                            >
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "transparent",
                                    }}
                                    onPress={() => setOpen(false)}
                                    activeOpacity={1}
                                >
                                    <View
                                        style={{
                                            marginTop: "auto",
                                            width: "100%",
                                            height: "50%",
                                            backgroundColor:
                                                layout.colors.secondaryColor,
                                        }}
                                    >
                                        <Text
                                            onPress={() => setOpen(false)}
                                            style={{
                                                color: "#fff",
                                                fontSize: 22.5,
                                                fontFamily: "Menlo",
                                            }}
                                        >
                                            @
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Modal> */}
                                </>
                            ),
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={
                                        {
                                            // paddingTop: 10,
                                        }
                                    }
                                >
                                    <Octicons
                                        name="person"
                                        size={TAB_BAR_ICON_SIZE}
                                        color={focused ? "#fff" : "#838383"}
                                    />
                                </View>
                            ),
                        }}
                        listeners={({ navigation }) => ({
                            tabPress: () => {
                                Haptics.selectionAsync();
                                navigation.navigate("Profile");
                            },
                        })}
                        name="Profile"
                        component={Profile}
                    />
                </Tab.Navigator>
                <CreateModal bottomSheetRef={bottomSheetRef} />
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};
