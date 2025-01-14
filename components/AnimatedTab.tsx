import React from "react";
import { Animated, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tabsStyles as styles } from "@/styles/tabs.styles";

interface AnimatedTabProps {
  children: React.ReactNode;
  onPress: () => void;
  accessibilityState: {
    selected: boolean;
  };
}

export const AnimatedTab: React.FC<AnimatedTabProps> = ({
  children,
  onPress,
  accessibilityState,
}) => {
  const focused = accessibilityState.selected;
  const animation = React.useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme() as "light" | "dark";

  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [focused, animation]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles(colorScheme).tabButton}
    >
      <Animated.View
        style={[
          styles(colorScheme).tabContent,
          {
            transform: [
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                }),
              },
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles(colorScheme).tabBackground,
            {
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.15],
              }),
            },
          ]}
        />
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
