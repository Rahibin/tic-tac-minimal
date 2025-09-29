
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/button';
import { commonStyles, colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

type Player = 'X' | 'O';

export default function PlayerSelection() {
  const { mode, difficulty } = useLocalSearchParams<{ mode: string; difficulty?: string }>();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  console.log('Player selection screen with mode:', mode, 'difficulty:', difficulty);

  const handlePlayerSelect = (player: Player) => {
    console.log('Player selected:', player);
    setSelectedPlayer(player);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartGame = () => {
    if (!selectedPlayer) {
      console.log('No player selected');
      return;
    }
    
    console.log('Starting game with player:', selectedPlayer, 'mode:', mode, 'difficulty:', difficulty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const gameParams = `mode=${mode}&player=${selectedPlayer}${difficulty ? `&difficulty=${difficulty}` : ''}`;
    router.push(`/game?${gameParams}`);
  };

  const handleBack = () => {
    console.log('Going back to previous screen');
    router.back();
  };

  const getDifficultyDisplay = () => {
    if (!difficulty) return '';
    
    switch (difficulty) {
      case 'easy':
        return ' (Easy Mode)';
      case 'medium':
        return ' (Medium Mode)';
      case 'hard':
        return ' (Hard Mode)';
      default:
        return '';
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundAlt]}
      style={commonStyles.wrapper}
    >
      <Stack.Screen
        options={{
          title: 'Choose Your Symbol',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Choose Your Symbol</Text>
          <Text style={[commonStyles.text, { marginBottom: 40 }]}>
            {mode === 'computer' 
              ? `Pick X or O to play against the computer${getDifficultyDisplay()}` 
              : 'Player 1, choose your symbol'
            }
          </Text>

          <View style={styles.selectionContainer}>
            <Pressable
              style={[
                styles.symbolCard,
                selectedPlayer === 'X' && styles.selectedCard
              ]}
              onPress={() => handlePlayerSelect('X')}
            >
              <Text style={[
                styles.symbolText,
                selectedPlayer === 'X' && styles.selectedSymbolText
              ]}>
                X
              </Text>
              <Text style={[
                styles.symbolLabel,
                selectedPlayer === 'X' && styles.selectedLabel
              ]}>
                {mode === 'computer' ? 'You go first' : 'Player 1'}
              </Text>
              {selectedPlayer === 'X' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.symbolCard,
                selectedPlayer === 'O' && styles.selectedCard
              ]}
              onPress={() => handlePlayerSelect('O')}
            >
              <Text style={[
                styles.symbolText,
                selectedPlayer === 'O' && styles.selectedSymbolText
              ]}>
                O
              </Text>
              <Text style={[
                styles.symbolLabel,
                selectedPlayer === 'O' && styles.selectedLabel
              ]}>
                {mode === 'computer' ? 'Computer goes first' : 'Player 1'}
              </Text>
              {selectedPlayer === 'O' && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleStartGame}
              variant="filled"
              size="lg"
              disabled={!selectedPlayer}
              style={[
                styles.startButton,
                !selectedPlayer && styles.disabledButton
              ]}
            >
              Start Game
            </Button>
            
            <Button
              onPress={handleBack}
              variant="outline"
              size="md"
              style={styles.backButton}
            >
              Back
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  symbolCard: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.grey + '30',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
    minHeight: 160,
    position: 'relative',
  },
  selectedCard: {
    borderColor: colors.accent,
    backgroundColor: colors.primary + '40',
    boxShadow: '0px 6px 16px rgba(100, 181, 246, 0.3)',
    elevation: 6,
  },
  symbolText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  selectedSymbolText: {
    color: colors.accent,
  },
  symbolLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedLabel: {
    color: colors.accent,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.accent,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 20,
  },
  startButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  backButton: {
    width: '100%',
  },
});
