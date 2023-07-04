import { View, Text } from "react-native";
import React from "react";
import { Rect, Svg } from "react-native-svg";

const Progress = ({ progress }) => {
  const barwidth = 230;
  const progressWidth = (progress / 100) * barwidth;

  return (
    <View>
      <Svg width={barwidth} height={"7"}>
        <Rect
          width={barwidth}
          height={"100%"}
          fill={"lightgray"}
          rx={3.5}
          ry={3.5}
        />
        <Rect
          width={progressWidth}
          height={"100%"}
          fill={"blue"}
          rx={3.5}
          ry={3.5}
        />
      </Svg>
    </View>
  );
};

export default Progress;
