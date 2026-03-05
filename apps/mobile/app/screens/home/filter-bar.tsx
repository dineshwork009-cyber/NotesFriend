import React from "react";
import { View } from "react-native";
import { Button } from "../../components/ui/button";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";

export const FilterBar = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: DefaultAppStyles.GAP,
        width: "93%",
        alignSelf: "center"
      }}
    >
      {[
        {
          name: "All"
        },
        {
          name: "Favorites"
        }
      ].map((item) => (
        <Button
          key={item.name}
          title={item.name}
          type="secondary"
          style={{
            paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
          }}
        />
      ))}
      <Button
        key="add"
        icon="plus"
        type="secondary"
        iconSize={AppFontSize.md}
        style={{
          paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL
        }}
      />
    </View>
  );
};
