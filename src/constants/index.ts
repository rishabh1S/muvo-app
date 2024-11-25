import { Dimensions, Platform } from "react-native";

const ios = Platform.OS === "ios";
const android = Platform.OS === "android";
const { width, height } = Dimensions.get("window");

export { ios, android, width, height };
