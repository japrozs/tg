import { Feather, Octicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import { layout } from "../constants";
import { PostSnippetFragment } from "../generated/graphql";

interface PostCardProps {
    post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [postLiked, setPostLiked] = useState(
        post.likeStatus ? post.likeStatus == 1 : false
    );
    console.log(post);
    return (
        <View style={{ padding: 5, marginBottom: 20 }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <Image
                    style={{
                        width: layout.images.postImgIconWidth,
                        height: layout.images.postImgIconHeight,
                        borderRadius: layout.images.postImgIconWidth / 2,
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: layout.colors.borderColor,
                    }}
                    source={{
                        uri: "https://pbs.twimg.com/media/FlJwVcJXoAMvWHW.jpg",
                    }}
                />
                <Text
                    style={{
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: 16,
                    }}
                >
                    {post.creator.username}
                </Text>

                <TouchableHighlight
                    style={{
                        marginLeft: "auto",
                        marginRight: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        Haptics.selectionAsync();
                    }}
                >
                    <Octicons name="kebab-horizontal" size={17} color="#fff" />
                </TouchableHighlight>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                {/* <Text
                    style={{
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: 15,
                    }}
                >
                    japrozs
                </Text> */}
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 15,
                        marginLeft: 4,
                    }}
                >
                    {post.body} {postLiked ? "yes" : "no"}
                </Text>
            </View>
            {post.attachments.length > 0 ? (
                <Image
                    style={{
                        width: "auto",
                        aspectRatio: 1,
                        borderRadius: layout.images.postImgIconWidth / 2,
                        borderWidth: 1,
                        borderColor: layout.colors.borderColor,
                    }}
                    source={{
                        uri: "https://i.ibb.co/cXf0jG2/IMG-1713.jpgx",
                    }}
                />
            ) : null}
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 15,
                }}
            >
                <TouchableHighlight
                    style={{ marginLeft: 5, marginRight: 15 }}
                    onPress={() => {
                        Haptics.selectionAsync();
                        setPostLiked(!postLiked);
                    }}
                >
                    {postLiked ? (
                        <Octicons
                            name="heart-fill"
                            size={22}
                            color={layout.colors.redColor}
                        />
                    ) : (
                        <Octicons name="heart" size={22} color="#fff" />
                    )}
                </TouchableHighlight>
                <TouchableHighlight
                    style={{ marginLeft: 5, marginRight: 15 }}
                    onPress={() => {
                        Haptics.selectionAsync();
                    }}
                >
                    <Octicons name="comment" size={22} color="#fff" />
                </TouchableHighlight>
                <TouchableHighlight
                    style={{ marginLeft: 5, marginRight: 15 }}
                    onPress={() => {
                        Haptics.selectionAsync();
                    }}
                >
                    <Feather name="send" size={22} color="#fff" />
                </TouchableHighlight>
                <TouchableHighlight
                    style={{
                        marginLeft: "auto",
                        marginRight: 20,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        Haptics.selectionAsync();
                    }}
                    underlayColor="transparent" // optional, to avoid highlight flash
                >
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text
                            style={{
                                color: layout.colors.redColor,
                                fontWeight: "600",
                                fontSize: 15,
                                marginRight: 10,
                            }}
                        >
                            #112
                        </Text>
                        <Octicons
                            name="flame"
                            size={18}
                            color={layout.colors.redColor}
                        />
                    </View>
                </TouchableHighlight>

                <Text
                    style={{
                        color: layout.colors.secondaryColor,
                        fontWeight: "600",
                        fontSize: 15,
                        // marginLeft: "auto",
                        marginRight: 0,
                    }}
                >
                    3h ago
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({});
