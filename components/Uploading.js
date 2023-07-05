import React from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Progress from "./Progress";
import { Video } from "expo-av";

export default function Uploading({
  image,
  video,
  progress,
  uploadCancelHandler,
}) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { flex: 1, justifyContent: "center", alignItems: "center" },
      ]}
    >
      <BlurView
        intensity={30}
        style={[
          StyleSheet.absoluteFill,
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "70%",
            paddingVertical: 16,
            rowGap: 12,
            backgroundColor: "white",
            borderRadius: 14,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: "black",
          }}
        >
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
                borderRadius: 6,
              }}
            />
          )}
          {video && (
            <Video
              source={{ uri: video }}
              videoStyle={{}}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              style={{ width: 200, height: 200 }}
              //   useNativeControls={false}
              // shouldPlay={true}
              // isLooping={true}
            />
          )}
          <Text>Uploading....</Text>
          <Progress progress={progress} />
          <View
            style={{
              height: 1,
              borderWidth: StyleSheet.hairlineWidth,
              width: "100%",
              borderColor: "#00000020",
            }}
          />

          <TouchableOpacity style={{}} onPress={uploadCancelHandler}>
            <Text style={{ fontWeight: "500", color: "#3478f6", fontSize: 17 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});
