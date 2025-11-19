import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { PostCard } from "../../components/post-card";
// import { useMeQuery } from "../../generated/graphql";
import { MainStackNav } from "./main-nav";
import { useGetPostsQuery } from "../../generated/graphql";

export const Main: React.FC<MainStackNav<"Home">> = () => {
    const { data, loading } = useGetPostsQuery();
    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            ) : !data?.getPosts || data.getPosts.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No posts found</Text>
                </View>
            ) : (
                <FlatList
                    data={data.getPosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <PostCard post={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    listContent: {
        paddingVertical: 12,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#fff",
        fontFamily: "Menlo",
    },
});
