import React from "react";
import { Stack, router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View, Text } from "react-native";
// Components
import { IconCircle } from "@/components/IconCircle";
import { IconSymbol } from "@/components/IconSymbol";
import { BodyScrollView } from "@/components/BodyScrollView";
import { Button } from "@/components/button";
// Constants & Hooks
import { backgroundColors } from "@/constants/Colors";

const ICON_COLOR = "#007AFF";

export default function HomeScreen() {

  const modalDemos = [
    {
      title: "Tic Tac Toe",
      description: "Play the classic game with minimalist design",
      route: "/mode-selection",
      color: "#FF6B6B",
      icon: "grid.circle",
    },
    {
      title: "Standard Modal",
      description: "Full screen modal presentation",
      route: "/modal",
      color: "#007AFF",
      icon: "square.grid.3x3",
    },
    {
      title: "Form Sheet",
      description: "Bottom sheet with detents and grabber",
      route: "/formsheet",
      color: "#34C759",
      icon: "square.grid.3x3",
    },
    {
      title: "Transparent Modal",
      description: "Overlay without obscuring background",
      route: "/transparent-modal",
      color: "#FF9500",
      icon: "square.grid.3x3",
    }
  ];

  const renderModalDemo = ({ item }: { item: typeof modalDemos[0] }) => (
    <View style={styles.demoCard}>
      <View style={[styles.demoIcon, { backgroundColor: item.color }]}>
        <IconSymbol name={item.icon as any} color="white" size={24} />
      </View>
      <View style={styles.demoContent}>
        <Text style={styles.demoTitle}>{item.title}</Text>
        <Text style={styles.demoDescription}>{item.description}</Text>
      </View>
      <Button
        variant="outline"
        size="sm"
        onPress={() => router.push(item.route as any)}
      >
        {item.title === "Tic Tac Toe" ? "Play" : "Try It"}
      </Button>
    </View>
  );

  const renderEmptyList = () => (
    <BodyScrollView contentContainerStyle={styles.emptyStateContainer}>
      <IconCircle
        emoji=""
        backgroundColor={
          backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
        }
      />
    </BodyScrollView>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {console.log("plus")}}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={ICON_COLOR} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => {console.log("gear")}}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name="gear"
        color={ICON_COLOR}
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Natively Apps",
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={modalDemos}
          renderItem={renderModalDemo}
          keyExtractor={(item) => item.route}
          contentContainerStyle={styles.listContainer}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  demoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  demoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  demoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  emptyStateContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  headerButtonContainer: {
    padding: 6, // Just enough padding around the 24px icon
  },
});
