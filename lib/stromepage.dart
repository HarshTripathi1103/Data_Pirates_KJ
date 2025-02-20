import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:chess/Solopage.dart';
import 'package:chess/authpages.dart/auth.dart';
import 'package:chess/backvideo.dart';
import 'package:chess/deadpieces.dart';
import 'package:chess/helper.dart';
import 'package:chess/main.dart';
import 'package:chess/pieces.dart';
import 'package:chess/square.dart';

class Stromepage extends StatefulWidget {
  const Stromepage({super.key});

  @override
  State<Stromepage> createState() => _StromepageState();
}

class _StromepageState extends State<Stromepage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(

        child: Stack(
          children: [
            // Background Video
         Container(
          height: 560,
          width: 370,
           child: Positioned.fill(
              child: FullScreenVideo(),
            ),
         ),


            // Overlay Content
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    height: 540,
                  ),
 MinimalButton(
              text: "Multiplayer Offline",
              onPressed: () {
                showLoadingAndNavigate(context, Newpage());
              },
              color: Color(0xFFebd3a7),
              horizontal: 100,
            ),
            const SizedBox(height: 20), // Space between buttons
            MinimalButton(
              text: "Single Player",
              onPressed: () {
               showLoadingAndNavigate(context, Solopage());
              },
              color: Color(0xFFe5a65c),
              horizontal: 120,
            ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
