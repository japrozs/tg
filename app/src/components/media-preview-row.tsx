import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { layout } from "../constants";
import DraggableFlatList, {
    RenderItemParams,
} from "react-native-draggable-flatlist";
import * as Haptics from "expo-haptics";
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface MediaPreviewRowProps {
    media: ImagePicker.ImagePickerAsset[];
    setMedia: React.Dispatch<
        React.SetStateAction<ImagePicker.ImagePickerAsset[]>
    >;
    onAddMore?: () => void;
}

const MediaPreviewRow: React.FC<MediaPreviewRowProps> = ({
    media,
    setMedia,
    onAddMore,
}) => {
    const removeMedia = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const formatDuration = (durationInMilliseconds: number) => {
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);

        if (durationInSeconds < 60) {
            return `${durationInSeconds}s`;
        }
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const renderItem = ({
        item,
        drag,
        isActive,
        getIndex,
    }: RenderItemParams<ImagePicker.ImagePickerAsset>) => {
        const index = getIndex();

        const animatedStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        scale: withSpring(isActive ? 1.08 : 1, {
                            damping: 20,
                            stiffness: 200,
                            mass: 0.5,
                        }),
                    },
                ],
                opacity: withTiming(isActive ? 0.9 : 1, {
                    duration: 150,
                }),
            };
        });

        return (
            <Animated.View style={[styles.mediaItem, animatedStyle]}>
                <TouchableOpacity
                    onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        drag();
                    }}
                    delayLongPress={300}
                    disabled={isActive}
                    activeOpacity={1}
                    style={{ flex: 1 }}
                >
                    {item.type === "video" ? (
                        <Video
                            source={{ uri: item.uri }}
                            style={styles.thumbnail}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay
                            isLooping
                            isMuted
                        />
                    ) : (
                        <Image
                            source={{ uri: item.uri }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                    )}
                    {/* Duration for videos */}
                    {item.type === "video" && item.duration && (
                        <View style={styles.durationBadge}>
                            <Text style={styles.durationText}>
                                {formatDuration(item.duration)}
                            </Text>
                        </View>
                    )}
                    {/* Remove button */}
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() =>
                            index !== undefined && removeMedia(index)
                        }
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="close"
                            size={18}
                            color={layout.colors.redColor}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <DraggableFlatList
                data={media}
                onDragEnd={({ data }) => setMedia(data)}
                keyExtractor={(item, index) => `${item.uri}-${index}`}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    media.length < 10 && onAddMore ? (
                        <TouchableOpacity
                            style={styles.addMoreButton}
                            onPress={onAddMore}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={40}
                                color={layout.colors.searchBarBgColor}
                            />
                        </TouchableOpacity>
                    ) : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    contentContainer: {
        paddingRight: 10,
    },
    mediaItem: {
        position: "relative",
        marginRight: 14,
        borderRadius: 16,
        overflow: "hidden",
    },
    thumbnail: {
        width: 150,
        height: 150,
        borderRadius: 16,
        backgroundColor: "#222",
    },
    durationBadge: {
        position: "absolute",
        bottom: 6,
        left: 6,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: "white",
        fontSize: 11,
        fontWeight: "600",
    },
    removeButton: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: layout.colors.searchBarBgColor,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#555",
    },
    addMoreButton: {
        width: 150,
        height: 150,
        borderRadius: 16,
        borderWidth: 2,
        marginRight: 14,
        borderColor: layout.colors.searchBarBgColor,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
});

export default MediaPreviewRow;
