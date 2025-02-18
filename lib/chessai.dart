import 'package:chess/pieces.dart';
import 'package:flutter/services.dart';
import 'dart:math' as math ;
import 'package:tflite_flutter/tflite_flutter.dart';

class ChessAI {
  late Interpreter _interpreter;
  final int boardSize = 8;
  final int inputSize = 8 * 8 * 12; // 8x8 board with 12 piece types (6 per color)
  
  // Piece encoding constants
  static const Map<String, int> pieceToIndex = {
    'wp': 0,  // white pawn
    'wr': 1,  // white rook
    'wn': 2,  // white knight
    'wb': 3,  // white bishop
    'wq': 4,  // white queen
    'wk': 5,  // white king
    'bp': 6,  // black pawn
    'br': 7,  // black rook
    'bn': 8,  // black knight
    'bb': 9,  // black bishop
    'bq': 10, // black queen
    'bk': 11, // black king
  };

  Future<void> loadModel() async {
    try {
      _interpreter = await Interpreter.fromAsset('assets/chess_ai.tflite');
    } catch (e) {
      print('Error loading model: $e');
      rethrow;
    }
  }

  List<double> boardToInput(List<List<ChessPiece?>> board) {
    List<double> input = List.filled(inputSize, 0);
    
    for (int row = 0; row < boardSize; row++) {
      for (int col = 0; col < boardSize; col++) {
        ChessPiece? piece = board[row][col];
        if (piece != null) {
          // Convert piece to encoding
          String pieceCode = (piece.iswhite ? 'w' : 'b') + 
                           piece.type.toString().split('.').last[0].toLowerCase();
          int index = pieceToIndex[pieceCode]!;
          
          // Set the corresponding position in the input array
          input[row * boardSize * 12 + col * 12 + index] = 1.0;
        }
      }
    }
    return input;
  }

  List<List<int>> getAIMove(List<List<ChessPiece?>> board) {
    // First try to use the TFLite model
    try {
      List<double> input = boardToInput(board);
      List<List<double>> inputArray = [input];
      List<List<double>> outputBuffer = List.generate(
        1, 
        (index) => List<double>.filled(boardSize * boardSize * boardSize * boardSize, 0)
      );
      
      _interpreter.run(inputArray, outputBuffer);
      
      List<double> output = outputBuffer[0];
      int maxIndex = 0;
      double maxValue = output[0];
      
      for (int i = 1; i < output.length; i++) {
        if (output[i] > maxValue) {
          maxValue = output[i];
          maxIndex = i;
        }
      }
      
      int fromRow = (maxIndex ~/ (boardSize * boardSize * boardSize)) % boardSize;
      int fromCol = (maxIndex ~/ (boardSize * boardSize)) % boardSize;
      int toRow = (maxIndex ~/ boardSize) % boardSize;
      int toCol = maxIndex % boardSize;
      
      if (isValidMove(board, fromRow, fromCol, toRow, toCol)) {
        return [[fromRow, fromCol], [toRow, toCol]];
      }
    } catch (e) {
      print('TFLite inference failed: $e - falling back to heuristic evaluation');
    }
    
    // Fallback to heuristic evaluation if TFLite fails
    return getFallbackMove(board);
  }
  
  List<List<int>> getFallbackMove(List<List<ChessPiece?>> board) {
    List<List<List<int>>> allPossibleMoves = [];
    
    // Scan the board for black pieces
    for (int row = 0; row < 8; row++) {
      for (int col = 0; col < 8; col++) {
        if (board[row][col] != null && !board[row][col]!.iswhite) {
          List<List<int>> validMoves = calculateRawValidMoves(row, col, board[row][col], board);
          
          for (var move in validMoves) {
            allPossibleMoves.add([
              [row, col],  // Source position
              move        // Destination position
            ]);
          }
        }
      }
    }
    
    if (allPossibleMoves.isEmpty) {
      return [];
    }

    List<double> moveScores = allPossibleMoves.map((move) {
      return evaluateMove(board, move[0][0], move[0][1], move[1][0], move[1][1]);
    }).toList();

    int bestMoveIndex = 0;
    double bestScore = moveScores[0];
    
    for (int i = 1; i < moveScores.length; i++) {
      if (moveScores[i] > bestScore) {
        bestScore = moveScores[i];
        bestMoveIndex = i;
      }
    }

    return allPossibleMoves[bestMoveIndex];
  }

  bool isValidMove(List<List<ChessPiece?>> board, int fromRow, int fromCol, int toRow, int toCol) {
    // Check if the source square has a piece
    if (board[fromRow][fromCol] == null) return false;
    
    // Check if the piece is black (AI's color)
    if (board[fromRow][fromCol]!.iswhite) return false;
    
    // Check if the destination is within bounds
    if (toRow < 0 || toRow >= boardSize || toCol < 0 || toCol >= boardSize) return false;
    
    // Check if the destination square has a friendly piece
    if (board[toRow][toCol]?.iswhite == false) return false;
    
    // Validate using the game's move rules
    List<List<int>> validMoves = calculateRawValidMoves(fromRow, fromCol, board[fromRow][fromCol], board);
    return validMoves.any((move) => move[0] == toRow && move[1] == toCol);
  }

  double evaluateMove(List<List<ChessPiece?>> board, int fromRow, int fromCol, int toRow, int toCol) {
    double score = 0.0;
    
    ChessPiece movingPiece = board[fromRow][fromCol]!;
    
    if (board[toRow][toCol] != null) {
      score += getPieceValue(board[toRow][toCol]!.type);
    }
    
    switch (movingPiece.type) {
      case ChessPieceType.pawn:
        score += (7 - toRow) * 0.1;
        if (toRow == 0) score += 8.0;
        break;
        
      case ChessPieceType.knight:
        score += (4 - ((3.5 - toRow).abs() + (3.5 - toCol).abs())) * 0.1;
        break;
        
      case ChessPieceType.bishop:
        score += calculateDiagonalControl(board, toRow, toCol) * 0.2;
        break;
        
      case ChessPieceType.rook:
        score += calculateVerticalControl(board, toCol) * 0.2;
        break;
        
      case ChessPieceType.queen:
        if (board[toRow][toCol] == null) {
          score -= 0.3;
        }
        break;
        
      case ChessPieceType.king:
        if (board[toRow][toCol] == null) {
          score -= 0.5;
        }
        break;
    }
    
    return score;
  }

  double getPieceValue(ChessPieceType type) {
    switch (type) {
      case ChessPieceType.pawn:
        return 1.0;
      case ChessPieceType.knight:
        return 3.0;
      case ChessPieceType.bishop:
        return 3.0;
      case ChessPieceType.rook:
        return 5.0;
      case ChessPieceType.queen:
        return 9.0;
      case ChessPieceType.king:
        return 0.0;
    }
  }

  int calculateDiagonalControl(List<List<ChessPiece?>> board, int row, int col) {
    int controlledSquares = 0;
    var directions = [[-1,-1], [-1,1], [1,-1], [1,1]];
    
    for (var direction in directions) {
      int r = row + direction[0];
      int c = col + direction[1];
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] == null) {
        controlledSquares++;
        r += direction[0];
        c += direction[1];
      }
    }
    
    return controlledSquares;
  }

  int calculateVerticalControl(List<List<ChessPiece?>> board, int col) {
    int controlledSquares = 0;
    
    for (int row = 0; row < 8; row++) {
      if (board[row][col] == null) {
        controlledSquares++;
      }
    }
    
    return controlledSquares;
  }

  List<List<int>> calculateRawValidMoves(int row, int col, ChessPiece? piece, List<List<ChessPiece?>> board) {
    // This should reference your game's move calculation logic
    // You'll need to implement this based on your chess rules
    List<List<int>> validMoves = [];
    // Implement chess piece movement rules here
    return validMoves;
  }
}