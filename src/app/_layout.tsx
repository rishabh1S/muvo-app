import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../context/auth";
import { GlobalProvider } from "../context/global";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <GlobalProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="streammovie/[mediaId]/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="streammovie/[mediaId]/[videoKey]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="streammovie/[mediaId]/watch"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="streamtv/[mediaId]/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="streamtv/[mediaId]/[videoKey]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="streamtv/[mediaId]/[season]/[episode]/watch"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="seeAll"
              options={{
                headerStyle: {
                  backgroundColor: "#000",
                },
                headerTitleStyle: {
                  fontWeight: "600",
                  fontSize: 20,
                },
              }}
            />
          </Stack>
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
