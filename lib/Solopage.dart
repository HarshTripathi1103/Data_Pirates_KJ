import 'dart:math';

import 'package:chess/chessai.dart';
import 'package:chess/deadpieces.dart';
import 'package:chess/helper.dart';
import 'package:chess/pieces.dart';
import 'package:chess/square.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// class Solopage extends StatefulWidget {
//   const Solopage({super.key});

//   @override
//   State<Solopage> createState() => _SolopageState();
// }

// class _SolopageState extends State<Solopage> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: AppBar(
//         title: Text("solomode"),
//       ),
//     );
//   }
// }

class Solopage extends StatefulWidget {
  const Solopage({super.key});


  @override
  State<Solopage> createState() => _SolopageState();
}

class _SolopageState extends State<Solopage> {



  late List<List<ChessPiece?>> board;
  ChessPiece ? selectedPiece;
  int selectedRow = -1;
  int selectedCol = -1;
  List<List<int>> validMoves=[];
  List<ChessPiece> whitePiecesTaken =[];
    List<ChessPiece> blackPiecesTaken =[];
    bool iswhiteturn = true;
    late ChessAI chessAI;



  @override
  void initState() {
    _initializeBoard();
    chessAI = ChessAI();
    chessAI.loadModel();
    super.initState();
  }

void _initializeBoard(){



  List<List<ChessPiece?>> newBoard = List.generate(8,(index)=> List.generate(8,(index)=> null));


// newBoard[3][3] = ChessPiece(type: ChessPieceType.queen, iswhite: false, imagePath: 'assets/pieces-basic-png/black-queen.png');
   // for pawns
for(int i =0;i<8;i++){
  newBoard[6][i] = ChessPiece(type: ChessPieceType.pawn, iswhite: true, imagePath: 'assets/pieces-basic-png/white-pawn.png');
  newBoard[1][i] = ChessPiece(type: ChessPieceType.pawn, iswhite: false, imagePath: 'assets/pieces-basic-png/black-pawn.png');
}
//fro rooks
newBoard[0][0] = ChessPiece(type: ChessPieceType.rook, iswhite: false, imagePath: 'assets/pieces-basic-png/black-rook.png');
newBoard[0][7] = ChessPiece(type: ChessPieceType.rook, iswhite: false, imagePath: 'assets/pieces-basic-png/black-rook.png');
newBoard[7][0] = ChessPiece(type: ChessPieceType.rook, iswhite: true, imagePath: 'assets/pieces-basic-png/white-rook.png');
newBoard[7][7] = ChessPiece(type: ChessPieceType.rook, iswhite: true, imagePath: 'assets/pieces-basic-png/white-rook.png');

//for horse
newBoard[0][1] = ChessPiece(type: ChessPieceType.knight, iswhite: false, imagePath: 'assets/pieces-basic-png/black-knight.png');
newBoard[0][6] = ChessPiece(type: ChessPieceType.knight, iswhite: false, imagePath: 'assets/pieces-basic-png/black-knight.png');
newBoard[7][1] = ChessPiece(type: ChessPieceType.knight, iswhite: true, imagePath: 'assets/pieces-basic-png/white-knight.png');
newBoard[7][6] = ChessPiece(type: ChessPieceType.knight, iswhite: true, imagePath: 'assets/pieces-basic-png/white-knight.png');

//for bishops
newBoard[0][2] = ChessPiece(type: ChessPieceType.bishop, iswhite: false, imagePath: 'assets/pieces-basic-png/black-bishop.png');
newBoard[0][5] = ChessPiece(type: ChessPieceType.bishop, iswhite: false, imagePath: 'assets/pieces-basic-png/black-bishop.png');
newBoard[7][2] = ChessPiece(type: ChessPieceType.bishop, iswhite: true, imagePath: 'assets/pieces-basic-png/white-bishop.png');
newBoard[7][5] = ChessPiece(type: ChessPieceType.bishop, iswhite: true, imagePath: 'assets/pieces-basic-png/white-bishop.png');

//for queens
newBoard[0][3] = ChessPiece(type: ChessPieceType.queen, iswhite: false, imagePath: 'assets/pieces-basic-png/black-queen.png');
newBoard[7][3] = ChessPiece(type: ChessPieceType.queen, iswhite: true, imagePath: 'assets/pieces-basic-png/white-queen.png');
//for kings
newBoard[0][4] = ChessPiece(type: ChessPieceType.king, iswhite: false, imagePath: 'assets/pieces-basic-png/black-king.png');
newBoard[7][4] = ChessPiece(type: ChessPieceType.king, iswhite: true, imagePath: 'assets/pieces-basic-png/white-king.png');


  board = newBoard;
}
    void pieceSelected(int row,int col){
      setState(() {
        if( selectedPiece == null &&  board[row][col]!=null){
          if (board[row][col]!.iswhite==iswhiteturn) {
  selectedPiece =board[row][col];
  selectedRow = row;
  selectedCol = col;
}
        }
        else if(board[row][col] != null && 
        board[row][col]!.iswhite == selectedPiece!.iswhite){
           selectedPiece =board[row][col];
          selectedRow = row;
          selectedCol = col;

        }

        else if(selectedPiece != null &&
           validMoves.any((element)=> element[0]== row && element[1]==col)){
            movePiece(row, col);
           }
         
          //to check if the move is valid by selecting a piece
        validMoves = calculateRawValidMoves(selectedRow,selectedCol,selectedPiece);
        
        
      });
    }
 calculateRawValidMoves(int row, int col,ChessPiece ? piece){
List<List<int>> candidateMoves= [];

if(piece == null){
  return[];
}

int direction = piece!.iswhite ? -1:1;

switch (piece.type) {
  //for check movements
  case ChessPieceType.pawn:
    if(isInBoard(row+direction, col) && board[row+direction][col]==null){
      candidateMoves.add([row + direction,col]);
    }
    // for double move at the start
    if((row==1 && !piece.iswhite)||(row == 6 && piece.iswhite)){
      if(isInBoard(row+2*direction, col) &&
      board[row+2*direction][col]==null && 
      board[row+direction][col]==null){
        candidateMoves.add([row+2*direction,col]);
      }
    }
    //for diagonal kill
    if(isInBoard(row+direction, col-1)&& board[row+direction][col-1]!=null && board[row+direction][col-1]!.iswhite !=piece.iswhite ){
candidateMoves.add([row+direction,col-1]);
    }
     if(isInBoard(row+direction, col+1)&& board[row+direction][col+1]!=null && board[row+direction][col+1]!.iswhite !=piece.iswhite ){
candidateMoves.add([row+direction,col+1]);
    }

    break;

     case ChessPieceType.rook:
     // going to move horizontal and 
     var directions =[
      [-1,0],
      [1,0],
      [0,-1],
      [0,1],
     ];

     for( var direction in directions){
      var i=1;
      while(true){
        var newRow = row+i*direction[0];
        var newCol = col+i*direction[1];
        if (!isInBoard(newRow, newCol)) {
          break;
        }
        if(board[newRow][newCol]!= null){
          if(board[newRow][newCol]!.iswhite != piece.iswhite){
            candidateMoves.add([newRow,newCol]);
          }
          break;

        }
        candidateMoves.add([newRow,newCol]);
        i++;
      }
     }
    
    break;
    
     case ChessPieceType.bishop:
     var directions=[

[-1,-1],
[-1,1],
[1,-1],
[1,1],
     ];
     //  shaped
    for (var direction in directions){

     var i = 1;
     while(true){
      var newRow = row + i* direction[0];
      var newCol  = col + i*direction[1];
      if (!isInBoard(newRow, newCol)) {

   break;
      }
      if (board[newRow][newCol] != null) {
        if(board[newRow][newCol]!.iswhite != piece.iswhite){
          candidateMoves.add([newRow,newCol]);
        }
        break;
        
      }
      candidateMoves.add([newRow,newCol]);
      i++;
     }
    }

    break;
    

     case ChessPieceType.knight:
      
    // Knight's moves
var knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
];

// Debugging output
print("Knight at ($row, $col)");

// Clear candidateMoves if needed


for (var move in knightMoves) {
    var newRow = row + move[0];
    var newCol = col + move[1];

    // Check if the move is within bounds
    if (!isInBoard(newRow, newCol)) {
        continue;
    }

    // Check if the target square is occupied
    if (board[newRow][newCol] != null) {
        // Check if it's an opponent's piece
        if (board[newRow][newCol]!.iswhite != piece.iswhite) {
            candidateMoves.add([newRow, newCol]); // Capture
        }
        continue; // Stop processing this move
    }

    // Add the empty square as a valid move
    candidateMoves.add([newRow, newCol]);
}

    break;
    
     case ChessPieceType.queen:
          var directions=[
            [-1,0],
      [1,0],
      [0,-1],
      [0,1],            
      [-1,-1],
      [-1,1],
      [1,-1],
      [1,1],

     ];
for (var direction in directions){
   var i =1;
  while(true){
    var newRow = row+i*direction[0];
     var newCol = col+i*direction[1];
     if(!isInBoard(newRow, newCol)){
        break;

     }
     if(board[newRow][newCol] != null){
       if(board[newRow][newCol]!.iswhite != piece.iswhite){
          candidateMoves.add([newRow,newCol]);
        }
        break;

     }
     candidateMoves.add([newRow,newCol]);
     i++;

  }
}

    
    break;
    
     case ChessPieceType.king:
      var directions = [
 [-1,0],
      [1,0],
      [0,-1],
      [0,1],            
      [-1,-1],
      [-1,1],
      [1,-1],
      [1,1],

     ];
     for(var direction in directions){
      var newRow = row + direction[0];
      var newCol =  col + direction[1];

      if (!isInBoard(newRow, newCol)) {
     continue;
        
      }

      if (board[newRow][newCol] !=null) {
        if(board[newRow][newCol]!.iswhite != piece.iswhite){
          candidateMoves.add([newRow,newCol]);
        }
        continue;
      }
      candidateMoves.add([newRow,newCol]);
     }


    
    break;
   
    

  default:
  
}
return candidateMoves ;
//different directions based on color

 }


void movePiece(int newRow,int newCol){

if (board[newRow][newCol] !=null) {
  var capturedPiece = board[newRow][newCol];
  if (capturedPiece!.iswhite) {
    whitePiecesTaken.add(capturedPiece);
    
  }
  else{
    blackPiecesTaken.add(capturedPiece);
  }
  
}
  //if the new spot has an enemy piece


  board[newRow][newCol] = selectedPiece;
  board[selectedRow][selectedCol]=null;

  setState(() {
    selectedPiece = null;
    selectedRow =-1;
    selectedCol =-1;
    validMoves =[];
  
  });

 iswhiteturn = !iswhiteturn; 

     if (!iswhiteturn) {
      Future.delayed(Duration(milliseconds: 500), () {
        aiMakeMove();
      });
}

}

void aiMakeMove() {
  List<List<int>> move = chessAI.getAIMove(board);
  if (move.isNotEmpty) {
    movePiece(move[0][0], move[0][1]);
  }
}


// void makeAIMove() {
//   List<double> boardState = getBoardState(); // Convert board to AI-friendly format
//   ChessAI ai = ChessAI();

//   List<double> aiMove = ai.getAIMove(boardState);

//   if (aiMove.isEmpty) {
//     // No move available
//     return;
//   }

//   // Apply the AI's move to the board
//   int aiRow = aiMove[0].toInt();
//   int aiCol = aiMove[1].toInt();

//   movePiece(aiRow, aiCol);
// }


  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
body: Column(
  children: [

    // for display of the white pieces taken
Expanded(
  child:GridView.builder(gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 8), 
  itemCount: whitePiecesTaken.length,
  itemBuilder: (context,index) =>Deadpieces(
    imagepath: whitePiecesTaken[index].imagePath ,
    isWhite: true,
  ))

),

    Expanded(
      flex: 3,
      child: GridView.builder(
        itemCount: 8*8,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 8),
       itemBuilder: (context, index) {
        int row = index ~/8;
        int col = index%8;
        bool isSelected = selectedRow == row && selectedCol == col; 
      
      bool isValidMove = false;
      
      for(var position in validMoves){
      if(position[0]==row && position[1]==col){
        isValidMove=true;
      
      }
      }
        return Square(isWhite: isWhite(index),
        piece: board[row][col],
        isSelected: isSelected,
        onTap:() => pieceSelected(row,col),
        isValidMove: isValidMove,
         );
        
      
       }),
    ),

    Expanded(
  child:GridView.builder(gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 8), 
  itemCount: blackPiecesTaken.length,
  itemBuilder: (context,index) =>Deadpieces(
    imagepath: blackPiecesTaken[index].imagePath ,
    isWhite: false,
  ))

),
  ],
),

    );
  }
}