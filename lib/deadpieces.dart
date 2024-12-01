
import 'package:flutter/material.dart';

class Deadpieces extends StatelessWidget {
  final String imagepath;
  final bool isWhite;
  const Deadpieces({super.key, required this.imagepath, required this.isWhite});

  @override
  Widget build(BuildContext context) {
    return Image.asset(imagepath);
  }
}