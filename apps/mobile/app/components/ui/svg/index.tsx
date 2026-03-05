import React from "react";
import { DimensionValue, View } from "react-native";
import { SvgXml } from "./lazy";
export const SvgView = ({
  width = 250,
  height = 250,
  src
}: {
  width?: DimensionValue;
  height?: DimensionValue;
  src?: string;
}) => {
  if (!src) return null;
  return (
    <View
      style={{
        height: width || 250,
        width: height || 250
      }}
    >
      <SvgXml xml={src} width="100%" height="100%" />
    </View>
  );
};
