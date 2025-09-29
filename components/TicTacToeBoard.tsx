
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

type Player = 'X' | 'O' | null;

interface TicTacToeBoardProps {
  board: Player[];
  onCellPress: (index: number) => void;
  disabled?: boolean;
  winningLine?: number[] | null;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({
  board,
  onCellPress,
  disabled = false,
  winningLine = null,
}) => {
  const renderCell = (index: number) => {
    const value = board[index];
    const scale = useSharedValue(1);
    const opacity = useSharedValue(value ? 1 : 0);

    React.useEffect(() => {
      if (value) {
        opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
        scale.value = withSequence(
          withSpring(1.2, { damping: 15, stiffness: 150 }),
          withSpring(1, { damping: 15, stiffness: 150 })
        );
      }
    }, [value]);

    const animatedTextStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const isWinningCell = winningLine?.includes(index);
    
    const animatedCellStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(disabled ? 0.95 : 1) }],
      backgroundColor: isWinningCell 
        ? withSpring(colors.accent + '40')
        : withSpring(colors.background),
    }));

    const handlePress = () => {
      if (!disabled && !value) {
        scale.value = withSequence(
          withTiming(0.9, { duration: 100 }),
          withSpring(1, { damping: 15, stiffness: 150 })
        );
        onCellPress(index);
      }
    };
    
    return (
      <AnimatedPressable
        key={index}
        style={[
          styles.cell,
          disabled && styles.cellDisabled,
          animatedCellStyle,
        ]}
        onPress={handlePress}
        disabled={disabled || value !== null}
      >
        <Animated.Text style={[
          styles.cellText,
          value === 'X' && styles.xText,
          value === 'O' && styles.oText,
          animatedTextStyle,
        ]}>
          {value || ''}
        </Animated.Text>
      </AnimatedPressable>
    );
  };

  return (
    <View style={styles.board}>
      <View style={styles.row}>
        {renderCell(0)}
        {renderCell(1)}
        {renderCell(2)}
      </View>
      <View style={styles.row}>
        {renderCell(3)}
        {renderCell(4)}
        {renderCell(5)}
      </View>
      <View style={styles.row}>
        {renderCell(6)}
        {renderCell(7)}
        {renderCell(8)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.grey + '20',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 85,
    height: 85,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.grey + '30',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    borderRadius: 16,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.12)',
    elevation: 3,
  },
  cellDisabled: {
    opacity: 0.6,
  },
  cellText: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  xText: {
    color: '#FF6B6B', // Red for X
  },
  oText: {
    color: '#4ECDC4', // Teal for O
  },
});
