
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/button';
import { commonStyles, colors } from '@/styles/commonStyles';

export default function ModeSelection() {
  const handleVsComputer = () => {
    console.log('Starting vs Computer mode');
    router.push('/game?mode=computer');
  };

  const handleVsHuman = () => {
    console.log('Starting vs Human mode');
    router.push('/game?mode=human');
  };

  const handleBack = () => {
    console.log('Going back to home');
    router.back();
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundAlt]}
      style={commonStyles.wrapper}
    >
      <Stack.Screen
        options={{
          title: 'Choose Game Mode',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Tic Tac Toe</Text>
          <Text style={[commonStyles.text, { marginBottom: 40 }]}>
            Choose your game mode
          </Text>

          <View style={styles.modeContainer}>
            <View style={styles.modeCard}>
              <Text style={styles.modeTitle}>🤖 vs Computer</Text>
              <Text style={styles.modeDescription}>
                Challenge our AI opponent
              </Text>
              <Button
                onPress={handleVsComputer}
                variant="filled"
                size="lg"
                style={styles.modeButton}
              >
                Play vs Computer
              </Button>
            </View>

            <View style={styles.modeCard}>
              <Text style={styles.modeTitle}>👥 vs Human</Text>
              <Text style={styles.modeDescription}>
                Play with a friend locally
              </Text>
              <Button
                onPress={handleVsHuman}
                variant="filled"
                size="lg"
                style={styles.modeButton}
              >
                Play vs Human
              </Button>
            </View>
          </View>

          <View style={styles.backButtonContainer}>
            <Button
              onPress={handleBack}
              variant="outline"
              size="md"
              style={styles.backButton}
            >
              Back to Home
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  modeContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  modeCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey + '20',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modeDescription: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modeButton: {
    width: '100%',
    minWidth: 200,
  },
  backButtonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  backButton: {
    width: '100%',
  },
});
