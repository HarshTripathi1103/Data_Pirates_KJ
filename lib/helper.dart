
import 'package:chess/loadingpage.dart';
import 'package:chess/pieces.dart';
import 'package:flutter/material.dart';

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


class MinimalButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final double horizontal;
  final Color? color; 

  const MinimalButton({required this.text, required this.onPressed, required this.horizontal, this.color});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        padding: EdgeInsets.symmetric(vertical: 20, horizontal: horizontal),
        backgroundColor: color ,
        side: BorderSide(color: Color(0xff93c5a6),width: 2),
      
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          
          
        ),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.black,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}


void showLoadingAndNavigate(BuildContext context, Widget nextPage) {
  showDialog(
    context: context,
    barrierDismissible: false, // Prevent dismissing by tapping outside
    builder: (context) => const Loadingpage(),
  );

  // Simulate a delay before navigating
  Future.delayed(const Duration(seconds: 2), () {
    Navigator.pop(context); // Close loading screen
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => nextPage),
    );
  });
}
