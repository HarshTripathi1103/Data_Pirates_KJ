import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class FullScreenVideo extends StatefulWidget {
  const FullScreenVideo({super.key});

  @override
  _FullScreenVideoState createState() => _FullScreenVideoState();
}

class _FullScreenVideoState extends State<FullScreenVideo> {
  late VideoPlayerController _controller;
  String? currentVideoPath;

  @override
  void initState() {
    super.initState();
    _initializeVideo('assets/some.mp4'); // Default video
  }

  void _initializeVideo(String path) {
    if (currentVideoPath == path) return; // Prevent unnecessary reloads

    currentVideoPath = path;
    _controller = VideoPlayerController.asset(path)
      ..initialize().then((_) {
        setState(() {}); // Refresh UI after initialization
        _controller.play();
        
        _controller.setLooping(false);
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var screenWidth = MediaQuery.of(context).size.width;
    String newVideoPath = screenWidth > 900 ? 'assets/reveal.mp4' : 'assets/reveal.mp4';

    // Check if video source needs updating
    if (newVideoPath != currentVideoPath) {
      _initializeVideo(newVideoPath);
    }

    return Scaffold(
      body: Center(
        child: _controller.value.isInitialized
            ? SizedBox(
                width: MediaQuery.of(context).size.width,
                height: MediaQuery.of(context).size.height,
                child: VideoPlayer(_controller),
              )
            : const CircularProgressIndicator(),
      ),
    );
  }
}
