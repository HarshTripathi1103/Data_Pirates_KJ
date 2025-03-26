import 'package:flutter/material.dart';

class Loadingpage extends StatefulWidget {
  const Loadingpage({super.key});

  @override
  State<Loadingpage> createState() => _LoadingpageState();
}

class _LoadingpageState extends State<Loadingpage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Container(
          child: Image.asset("assets/loading.gif"),
        ),
      ),
    );
  }
}