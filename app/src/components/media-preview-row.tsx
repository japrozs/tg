import React from "react";
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Text,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { layout } from "../constants";

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

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Add more button - only show if under 10 items */}
            {media.length < 10 && onAddMore && (
                <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={onAddMore}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={40}
                        color={layout.colors.redColor}
                    />
                </TouchableOpacity>
            )}
            {media.map((item, index) => (
                <View key={index} style={styles.mediaItem}>
                    <Image
                        source={{ uri: item.uri }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    {/* Video indicator */}
                    {item.type === "video" && (
                        <View style={styles.videoIndicator}>
                            <Ionicons
                                name="play-circle"
                                size={32}
                                color="white"
                            />
                        </View>
                    )}
                    {/* Duration for videos */}
                    {item.type === "video" && item.duration && (
                        <View style={styles.durationBadge}>
                            <Text style={styles.durationText}>
                                {Math.floor(item.duration)}s
                            </Text>
                        </View>
                    )}
                    {/* Remove button */}
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeMedia(index)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
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
        marginRight: 10,
        borderRadius: 12,
        overflow: "hidden",
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: "#222",
    },
    videoIndicator: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
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
        top: 4,
        right: 4,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 12,
    },
    addMoreButton: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: layout.colors.redColor,
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
});

export default MediaPreviewRow;
