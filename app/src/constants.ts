import { colors } from "./ui/theme";

// app constants
export const emptyIcon =
    "https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5ed68e8310716f0007411996%2F0x0.jpg";

export const TAB_BAR_ICON_SIZE = 23;

export const layout = {
    images: {
        postImgIconWidth: 30,
        postImgIconHeight: 30,
        profileImgWidth: 80,
        profileImgHeight: 80,
    },
    colors: {
        primaryColor: "#007AFF",
        borderColor: "#151A21",
        secondaryColor: "#323D4D",
        redColor: "#ff304f",
        redDarkColor: "#4c0519",
        searchBarBgColor: "#262626",
        modalBackgroundColor: "#040405ff",
        modalHandleIndicatorColor: "#333333",
    },
    styles: {
        button: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "#151A21",
            paddingVertical: 7.8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "49%",
            marginLeft: 5,
        },
        redButton: {
            borderWidth: 1,
            borderRadius: 10,
            // borderColor: "#151A21",
            backgroundColor: "#ff304f",
            paddingVertical: 7.8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "49%",
            marginLeft: 5,
        },
    },
};

export const constants = {
    logoHeight: 23,
    logoWidth: 56,
};
