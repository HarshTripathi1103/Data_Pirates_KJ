import 'package:chess/helper.dart';
import 'package:chess/pieces.dart';
import 'package:chess/values/colors.dart';
import 'package:flutter/material.dart';

class Square extends StatelessWidget {
  final bool isWhite;
  final ChessPiece? piece;
  final bool isSelected;
  final bool isValidMove;
  final void Function()? onTap;

  const Square({super.key, required this.isWhite, this.piece, required this.isSelected, this.onTap, required this.isValidMove});

  @override
  Widget build(BuildContext context) {
    Color ? squareColor;

    if(isSelected){
      squareColor = Colors.green;
    }
    else if(isValidMove){
squareColor =Colors.amberAccent;
    }
    else{
       squareColor= isWhite ? backgroundColor : foregroundColor;
    }
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          
 color: squareColor,
          border: Border.all(color: Colors.black,width: 2)
        ),
       
        child: piece != null ? Image.asset(piece!.imagePath):null,

        
      ),
    );
  }
}