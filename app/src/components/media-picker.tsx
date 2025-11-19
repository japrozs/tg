import React from "react";
import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
import MediaPreviewRow, { MediaItem } from "./media-preview-row";

type Props = {
    value: MediaItem[];
    onChange: (items: MediaItem[]) => void;
};

export default function MediaPicker({ value, onChange }: Props) {
    // Add new media
    const handleAdd = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ["images", "videos"],
            quality: 1,
            videoMaxDuration: 60,
        });

        if (result.canceled) return;

        const newItems: MediaItem[] = result.assets.map((asset) => ({
            id: asset.assetId ?? Math.random().toString(),
            uri: asset.uri,
            type: asset.type === "video" ? "video" : "image",
        }));

        onChange([...value, ...newItems]);
    };

    // Remove media
    const handleRemove = (id: string) => {
        onChange(value.filter((m) => m.id !== id));
    };

    // Reorder media
    const handleReorder = (items: MediaItem[]) => {
        onChange(items);
    };

    return (
        <View>
            <MediaPreviewRow
                media={value}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onReorder={handleReorder}
            />
        </View>
    );
}
