import {
    Button,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../../ui/theme";
import { MainStackNav } from "./main-nav";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { layout, TAB_BAR_ICON_SIZE } from "../../constants";
import {
    AntDesign,
    Feather,
    FontAwesome6,
    Ionicons,
    Octicons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useMeQuery } from "../../generated/graphql";
import Lucide from "@react-native-vector-icons/lucide";
import * as ImagePicker from "expo-image-picker";
import MediaPreviewRow from "../../components/media-preview-row";

interface CreateModalProps {
    bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}

export const CreateModal: React.FC<CreateModalProps> = ({ bottomSheetRef }) => {
    const { data, loading } = useMeQuery();
    const [body, setBody] = useState("");
    const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const onChangeBody = useCallback((t: string) => {
        setBody(t);
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.7}
                pressBehavior="none"
            />
        ),
        []
    );

    const pickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            selectionLimit: 10, // iOS only, Android allows unlimited so we'll enforce manually
            quality: 1,
            videoMaxDuration: 60, // optional
        });

        if (!result.canceled) {
            setMedia((prev) => {
                const combined = [...prev, ...result.assets];
                return combined.slice(0, 10); // enforce max 10 across platforms
            });
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });

        if (!result.canceled) {
            setMedia((prev) => {
                const combined = [...prev, ...result.assets];
                return combined.slice(0, 10);
            });
        }
    };

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            backgroundStyle={{
                backgroundColor: layout.colors.modalBackgroundColor,
                borderRadius: 25,
            }}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{
                backgroundColor: layout.colors.modalHandleIndicatorColor,
                paddingHorizontal: 30,
            }}
            onAnimate={(fromIndex, toIndex) => {
                if (toIndex === -1) {
                    Keyboard.dismiss();
                }
            }}
            index={0}
            snapPoints={["85%"]}
        >
            <BottomSheetView
                style={{
                    backgroundColor: layout.colors.modalBackgroundColor,
                    height: "100%",
                    flex: 1,
                }}
            >
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderBottomColor: layout.colors.borderColor,
                            paddingVertical: 6,
                            paddingHorizontal: 13,
                        }}
                    >
                        {/* TODO: RECONSIDER if we want to keep this cross icon
                              because we already have the modal handle bar
                    */}
                        <View style={{ flex: 1 }}>
                            <Ionicons
                                name="close-outline"
                                size={TAB_BAR_ICON_SIZE * 1.2}
                                color={"#555"}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    Keyboard.dismiss();
                                    setTimeout(() => {
                                        bottomSheetRef.current?.dismiss();
                                    }, 10);
                                }}
                            />
                        </View>

                        <View style={{ flex: 2, alignItems: "center" }}>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 17,
                                    fontWeight: "600",
                                }}
                            >
                                New post
                            </Text>
                        </View>

                        <View style={{ flex: 1 }} />
                    </View>
                    <View
                        style={{ paddingHorizontal: 10, paddingVertical: 15 }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "flex-start",
                            }}
                        >
                            <Image
                                source={{
                                    uri: "https://pbs.twimg.com/media/FlJwVcJXoAMvWHW.jpg",
                                }}
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 45 / 2,
                                    borderWidth: 1,
                                    borderColor: layout.colors.borderColor,
                                    flexShrink: 0,
                                }}
                            />
                            <View style={{ marginLeft: 13, width: "90%" }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 16,
                                        fontWeight: "500",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: layout.colors
                                                .modalHandleIndicatorColor,
                                        }}
                                    >
                                        {"@ "}
                                    </Text>
                                    {data?.me?.username}
                                </Text>
                                <TextInput
                                    placeholder="What's on your mind..."
                                    value={body}
                                    onChangeText={onChangeBody}
                                    placeholderTextColor={
                                        layout.colors.modalHandleIndicatorColor
                                    }
                                    autoFocus
                                    multiline
                                    keyboardAppearance="dark"
                                    keyboardType="default"
                                    autoCorrect={true}
                                    autoCapitalize="sentences"
                                    autoComplete="off"
                                    spellCheck={true}
                                    textBreakStrategy="highQuality"
                                    style={{
                                        marginTop: 1,
                                        marginBottom: 8,
                                        color: "#bbb",
                                        fontSize: 16,
                                        width: "90%",
                                    }}
                                />
                                {media.length > 0 && (
                                    <MediaPreviewRow
                                        media={media}
                                        setMedia={setMedia}
                                        onAddMore={pickMedia}
                                    />
                                )}
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: 14,
                                        marginTop: 22,
                                    }}
                                >
                                    <Lucide
                                        name="image"
                                        size={22}
                                        color={layout.colors.redColor}
                                        onPress={pickMedia}
                                    />
                                    <Feather
                                        name="camera"
                                        size={21}
                                        color={layout.colors.redColor}
                                        onPress={takePhoto}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor:
                                                layout.colors.redColor,
                                            marginLeft: "auto",
                                            marginRight: 25,
                                            paddingVertical: 8,
                                            paddingHorizontal: 16,
                                            borderRadius: 20,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: 15,
                                            }}
                                        >
                                            Post
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "grey",
    },
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: "center",
    },
});
