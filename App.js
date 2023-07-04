import { StatusBar, View } from "react-native";
import Home from "./screens/Home";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Home />
      <StatusBar barStyle={"dark-content"} />
    </View>
  );
}
