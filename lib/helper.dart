
import 'package:chess/pieces.dart';

bool isWhite(index){
  int x =index~/8;

  int y = index%8;
 
  bool isWhite = (x+y)%2==0;
  return isWhite;
}
bool isInBoard(int row, int col){
return row>=0 && row < 8 && col>=0 && col<8;
}

List<double> getBoardState() {
  List<double> boardState = [];

  for (int row = 0; row < 8; row++) {
    for (int col = 0; col < 8; col++) {
      var board;
      ChessPiece? piece = board[row][col];

      if (piece == null) {
        boardState.add(0.0); // Empty space
      } else {
        int pieceValue = piece.iswhite ? 1 : -1; // 1 for white, -1 for black
        int pieceType = piece.type.index + 1; // Get the type of piece (e.g., 1 for pawn, 2 for knight, etc.)

        // You could also create a more sophisticated representation of the board state here
        boardState.add(pieceValue * pieceType.toDouble());
      }
    }
  }

  return boardState;
}
