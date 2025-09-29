
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
type Difficulty = 'easy' | 'medium' | 'hard';

export default function Game() {
  const { mode, player, difficulty } = useLocalSearchParams<{ 
    mode: string; 
    player: string; 
    difficulty?: string; 
  }>();
  
  const gameMode = mode as GameMode;
  const playerSymbol = player as 'X' | 'O';
  const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
  const gameDifficulty = difficulty as Difficulty;
  
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  console.log('Game started with mode:', gameMode, 'player:', playerSymbol, 'difficulty:', gameDifficulty);

  // Start computer move if computer goes first
  useEffect(() => {
    if (gameMode === 'computer' && playerSymbol === 'O' && isGameActive && board.every(cell => cell === null)) {
      console.log('Computer goes first');
      makeComputerMove(board);
    }
  }, []);

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

  const getRandomMove = (boardState: Player[]): number => {
    const availableMoves = boardState
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const getBestMove = (boardState: Player[]): number => {
    // Check if computer can win
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        const testBoard = [...boardState];
        testBoard[i] = computerSymbol;
        if (checkWinner(testBoard).winner === computerSymbol) {
          return i;
        }
      }
    }

    // Check if computer needs to block player from winning
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        const testBoard = [...boardState];
        testBoard[i] = playerSymbol;
        if (checkWinner(testBoard).winner === playerSymbol) {
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
    return getRandomMove(boardState);
  };

  const getComputerMove = (boardState: Player[]): number => {
    const availableMoves = boardState
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];

    if (availableMoves.length === 0) return -1;

    switch (gameDifficulty) {
      case 'easy':
        // 70% random moves, 30% strategic moves
        if (Math.random() < 0.7) {
          console.log('Easy AI: Making random move');
          return getRandomMove(boardState);
        } else {
          console.log('Easy AI: Making strategic move');
          return getBestMove(boardState);
        }

      case 'medium':
        // 40% random moves, 60% strategic moves
        if (Math.random() < 0.4) {
          console.log('Medium AI: Making random move');
          return getRandomMove(boardState);
        } else {
          console.log('Medium AI: Making strategic move');
          return getBestMove(boardState);
        }

      case 'hard':
        // Always make the best move
        console.log('Hard AI: Making optimal move');
        return getBestMove(boardState);

      default:
        // Default to medium difficulty
        return getBestMove(boardState);
    }
  };

  const makeComputerMove = (boardState: Player[]) => {
    console.log('Computer is making a move with difficulty:', gameDifficulty);
    
    const computerMove = getComputerMove(boardState);
    if (computerMove === -1) return;

    setTimeout(() => {
      const newBoard = [...boardState];
      newBoard[computerMove] = computerSymbol;
      setBoard(newBoard);

      const { winner: gameWinner, line } = checkWinner(newBoard);
      const gameDraw = checkDraw(newBoard);

      if (gameWinner) {
        setWinner(gameWinner);
        setWinningLine(line);
        setIsGameActive(false);
        // Haptic feedback for computer win
        Haptics.notificationAsync(
          gameWinner === playerSymbol 
            ? Haptics.NotificationFeedbackType.Success 
            : Haptics.NotificationFeedbackType.Error
        );
        console.log('Game won by:', gameWinner);
      } else if (gameDraw) {
        setIsDraw(true);
        setIsGameActive(false);
        // Haptic feedback for draw
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        console.log('Game is a draw');
      } else {
        setCurrentPlayer(playerSymbol);
      }
    }, 800); // Small delay for better UX
  };

  const handleCellPress = (index: number) => {
    if (!isGameActive || board[index] !== null) {
      console.log('Invalid move attempted at index:', index);
      return;
    }

    // Only allow player moves when it's their turn
    if (gameMode === 'computer' && currentPlayer !== playerSymbol) {
      console.log('Not player turn');
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
      Haptics.notificationAsync(
        gameWinner === playerSymbol 
          ? Haptics.NotificationFeedbackType.Success 
          : Haptics.NotificationFeedbackType.Error
      );
      console.log('Game won by:', gameWinner);
    } else if (gameDraw) {
      setIsDraw(true);
      setIsGameActive(false);
      // Haptic feedback for draw
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      console.log('Game is a draw');
    } else {
      if (gameMode === 'computer') {
        setCurrentPlayer(computerSymbol);
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

    // If computer goes first, make computer move
    if (gameMode === 'computer' && playerSymbol === 'O') {
      setTimeout(() => {
        makeComputerMove(Array(9).fill(null));
      }, 500);
    }
  };

  const handleBack = () => {
    console.log('Going back to previous screen');
    router.back();
  };

  const getGameStatus = () => {
    if (winner) {
      if (gameMode === 'computer') {
        return winner === playerSymbol ? 'You Win! 🎉' : 'Computer Wins! 🤖';
      } else {
        return `Player ${winner} Wins! 🎉`;
      }
    }
    if (isDraw) {
      return "It's a Draw! 🤝";
    }
    if (gameMode === 'computer') {
      return currentPlayer === playerSymbol ? 'Your Turn' : 'Computer\'s Turn';
    } else {
      return `Player ${currentPlayer}'s Turn`;
    }
  };

  const getDifficultyDisplay = () => {
    if (gameMode !== 'computer' || !gameDifficulty) return '';
    
    const difficultyEmojis = {
      easy: '😊',
      medium: '🤔',
      hard: '🔥'
    };
    
    return ` ${difficultyEmojis[gameDifficulty]} ${gameDifficulty.charAt(0).toUpperCase() + gameDifficulty.slice(1)}`;
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundAlt]}
      style={commonStyles.wrapper}
    >
      <Stack.Screen
        options={{
          title: gameMode === 'computer' 
            ? `vs Computer${getDifficultyDisplay()}` 
            : 'vs Human',
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
            {gameMode === 'computer' && gameDifficulty && (
              <Text style={styles.difficultyText}>
                Difficulty: {gameDifficulty.charAt(0).toUpperCase() + gameDifficulty.slice(1)}
              </Text>
            )}
          </View>

          <TicTacToeBoard
            board={board}
            onCellPress={handleCellPress}
            disabled={!isGameActive || (gameMode === 'computer' && currentPlayer === computerSymbol)}
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
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey,
    textAlign: 'center',
    marginTop: 4,
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
