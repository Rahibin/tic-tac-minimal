
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/button';
import { TicTacToeBoard } from '@/components/TicTacToeBoard';
import { commonStyles, colors } from '@/styles/commonStyles';

type Player = 'X' | 'O' | null;
type GameMode = 'computer' | 'human';

export default function Game() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const gameMode = mode as GameMode;
  
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  console.log('Game started with mode:', gameMode);

  const checkWinner = (boardState: Player[]): { winner: Player; line: number[] | null } => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { winner: boardState[a], line: combination };
      }
    }

    return { winner: null, line: null };
  };

  const checkDraw = (boardState: Player[]): boolean => {
    return boardState.every(cell => cell !== null) && !checkWinner(boardState).winner;
  };

  const getBestMove = (boardState: Player[]): number => {
    // Check if computer can win
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        const testBoard = [...boardState];
        testBoard[i] = 'O';
        if (checkWinner(testBoard).winner === 'O') {
          return i;
        }
      }
    }

    // Check if computer needs to block player from winning
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        const testBoard = [...boardState];
        testBoard[i] = 'X';
        if (checkWinner(testBoard).winner === 'X') {
          return i;
        }
      }
    }

    // Take center if available
    if (boardState[4] === null) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => boardState[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available move
    const availableMoves = boardState
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const makeComputerMove = (boardState: Player[]) => {
    console.log('Computer is making a move');
    const availableMoves = boardState
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];

    if (availableMoves.length === 0) return;

    const computerMove = getBestMove(boardState);

    setTimeout(() => {
      const newBoard = [...boardState];
      newBoard[computerMove] = 'O';
      setBoard(newBoard);

      const { winner: gameWinner, line } = checkWinner(newBoard);
      const gameDraw = checkDraw(newBoard);

      if (gameWinner) {
        setWinner(gameWinner);
        setWinningLine(line);
        setIsGameActive(false);
        // Haptic feedback for computer win
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        console.log('Game won by:', gameWinner);
      } else if (gameDraw) {
        setIsDraw(true);
        setIsGameActive(false);
        // Haptic feedback for draw
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        console.log('Game is a draw');
      } else {
        setCurrentPlayer('X');
      }
    }, 800); // Small delay for better UX
  };

  const handleCellPress = (index: number) => {
    if (!isGameActive || board[index] !== null) {
      console.log('Invalid move attempted at index:', index);
      return;
    }

    // Haptic feedback for move
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    console.log('Player move at index:', index);
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    const gameDraw = checkDraw(newBoard);

    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setIsGameActive(false);
      // Haptic feedback for win
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('Game won by:', gameWinner);
    } else if (gameDraw) {
      setIsDraw(true);
      setIsGameActive(false);
      // Haptic feedback for draw
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      console.log('Game is a draw');
    } else {
      if (gameMode === 'computer' && currentPlayer === 'X') {
        setCurrentPlayer('O');
        makeComputerMove(newBoard);
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  };

  const resetGame = () => {
    console.log('Resetting game');
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setIsGameActive(true);
  };

  const handleBack = () => {
    console.log('Going back to mode selection');
    router.back();
  };

  const getGameStatus = () => {
    if (winner) {
      if (gameMode === 'computer') {
        return winner === 'X' ? 'You Win! 🎉' : 'Computer Wins! 🤖';
      } else {
        return `Player ${winner} Wins! 🎉`;
      }
    }
    if (isDraw) {
      return "It's a Draw! 🤝";
    }
    if (gameMode === 'computer') {
      return currentPlayer === 'X' ? 'Your Turn' : 'Computer\'s Turn';
    } else {
      return `Player ${currentPlayer}'s Turn`;
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundAlt]}
      style={commonStyles.wrapper}
    >
      <Stack.Screen
        options={{
          title: gameMode === 'computer' ? 'vs Computer' : 'vs Human',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Tic Tac Toe</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{getGameStatus()}</Text>
          </View>

          <TicTacToeBoard
            board={board}
            onCellPress={handleCellPress}
            disabled={!isGameActive || (gameMode === 'computer' && currentPlayer === 'O')}
            winningLine={winningLine}
          />

          <View style={styles.buttonContainer}>
            <Button
              onPress={resetGame}
              variant="filled"
              size="lg"
              style={styles.resetButton}
            >
              New Game
            </Button>
            
            <Button
              onPress={handleBack}
              variant="outline"
              size="md"
              style={styles.backButton}
            >
              Back to Menu
            </Button>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  resetButton: {
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
});
