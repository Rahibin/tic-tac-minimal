
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/button';
import { commonStyles, colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function DifficultySelection() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  console.log('Difficulty selection screen opened');

  const handleDifficultySelect = (difficulty: Difficulty) => {
    console.log('Difficulty selected:', difficulty);
    setSelectedDifficulty(difficulty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    if (!selectedDifficulty) {
      console.log('No difficulty selected');
      return;
    }
    
    console.log('Continuing with difficulty:', selectedDifficulty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/player-selection?mode=computer&difficulty=${selectedDifficulty}`);
  };

  const handleBack = () => {
    console.log('Going back to mode selection');
    router.back();
  };

  const getDifficultyInfo = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return {
          emoji: '😊',
          title: 'Easy',
          description: 'Perfect for beginners. The AI makes random moves most of the time.',
          color: '#4CAF50'
        };
      case 'medium':
        return {
          emoji: '🤔',
          title: 'Medium',
          description: 'Balanced gameplay. The AI plays strategically but makes occasional mistakes.',
          color: '#FF9800'
        };
      case 'hard':
        return {
          emoji: '🔥',
          title: 'Hard',
          description: 'Ultimate challenge! The AI plays perfectly and never makes mistakes.',
          color: '#F44336'
        };
    }
  };

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundAlt]}
      style={commonStyles.wrapper}
    >
      <Stack.Screen
        options={{
          title: 'Choose Difficulty',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Choose Difficulty</Text>
          <Text style={[commonStyles.text, { marginBottom: 40 }]}>
            Select how challenging you want the AI to be
          </Text>

          <View style={styles.difficultyContainer}>
            {difficulties.map((difficulty) => {
              const info = getDifficultyInfo(difficulty);
              const isSelected = selectedDifficulty === difficulty;
              
              return (
                <Pressable
                  key={difficulty}
                  style={[
                    styles.difficultyCard,
                    isSelected && styles.selectedCard,
                    isSelected && { borderColor: info.color }
                  ]}
                  onPress={() => handleDifficultySelect(difficulty)}
                >
                  <View style={styles.difficultyHeader}>
                    <Text style={styles.difficultyEmoji}>{info.emoji}</Text>
                    <Text style={[
                      styles.difficultyTitle,
                      isSelected && { color: info.color }
                    ]}>
                      {info.title}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: info.color }]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[
                    styles.difficultyDescription,
                    isSelected && styles.selectedDescription
                  ]}>
                    {info.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              variant="filled"
              size="lg"
              disabled={!selectedDifficulty}
              style={[
                styles.continueButton,
                !selectedDifficulty && styles.disabledButton
              ]}
            >
              Continue
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
  difficultyContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  difficultyCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.grey + '30',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: colors.primary + '20',
    boxShadow: '0px 6px 16px rgba(100, 181, 246, 0.3)',
    elevation: 6,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  difficultyDescription: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
  },
  selectedDescription: {
    color: colors.text,
  },
  checkmark: {
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
  continueButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  backButton: {
    width: '100%',
  },
});
