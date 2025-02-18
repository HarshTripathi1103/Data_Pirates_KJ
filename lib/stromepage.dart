
import 'package:chess/Solopage.dart';
import 'package:chess/authpages.dart/auth.dart';
import 'package:chess/deadpieces.dart';
import 'package:chess/helper.dart';
import 'package:chess/main.dart';
import 'package:chess/pieces.dart';
import 'package:chess/square.dart';
import 'package:flutter/material.dart';

class Stromepage extends StatefulWidget {
  const Stromepage({super.key});

  @override
  State<Stromepage> createState() => _StromepageState();
}

class _StromepageState extends State<Stromepage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          SizedBox(
            height: 250,
          ),
          ElevatedButton( onPressed: () { 
            Navigator.push(context, MaterialPageRoute(builder: (context) => Newpage()));

                  
   } , child: Text("two player offline")),
   ElevatedButton(onPressed: (){
   Navigator.push(context, MaterialPageRoute(builder: (context) => Solopage()));

   }, 
   child: Text("Play Solo"))


        ],
      ),
    );
  }
}