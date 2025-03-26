
import 'package:appwrite/appwrite.dart';
import 'package:appwrite/models.dart' as models;
import 'package:chess/config.dart';
import 'package:flutter/material.dart';

class MyWidget extends StatefulWidget {
  final Account account;
  const MyWidget({super.key, required this.account});

  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late Account account; // Declare account variable
  models.User? loggedInUser; // Nullable user
  final PageController _pageController = PageController();


  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController nameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    
    // Initialize Appwrite client
    final client = Client()
      .setEndpoint(Config.endpoint) // Replace with your Appwrite endpoint
      .setProject(Config.projectId); // Replace with your Appwrite project ID

    account = Account(client);
  }

  Future<void> login(String email, String password) async {
    try {
      await account.createEmailPasswordSession(email: email, password: password);
      final user = await account.get();
      setState(() {
        loggedInUser = user;
      });
    } catch (e) {
      print("Login Error: $e");
    }
  }

  Future<void> register(String email, String password, String name) async {
    try {
      await account.create(userId: ID.unique(), email: email, password: password, name: name);
      await login(email, password);
    } catch (e) {
      print("Registration Error: $e");
    }
  }

  Future<void> logout() async {
    try {
      await account.deleteSession(sessionId: 'current');
      setState(() {
        loggedInUser = null;
      });
    } catch (e) {
      print("Logout Error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
    body: Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blueAccent, Colors.purpleAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 50),
            Text(
              'Welcome to Chess App',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 20),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: BouncingScrollPhysics(),
                children: [
                  _buildModernAuthForm(isLogin: true),
                  _buildModernAuthForm(isLogin: false),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

Widget _buildModernAuthForm({required bool isLogin}) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
    child: Card(
      elevation: 5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              isLogin ? 'Login' : 'Register',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w600,
                color: Colors.blueAccent,
              ),
            ),
            SizedBox(height: 20),
            TextField(
              controller: emailController,
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: passwordController,
              decoration: InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
              obscureText: true,
            ),
            if (!isLogin) ...[
              SizedBox(height: 16),
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                if (isLogin) {
                  login(emailController.text, passwordController.text);
                } else {
                  register(emailController.text, passwordController.text, nameController.text);
                }
              },
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                backgroundColor: Colors.blueAccent,
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text(isLogin ? 'Login' : 'Register'),
            ),
            TextButton(
              onPressed: () {
                _pageController.animateToPage(
                  isLogin ? 1 : 0,
                  duration: Duration(milliseconds: 500),
                  curve: Curves.easeInOut,
                );
              },
              child: Text(
                isLogin ? "Don't have an account? Register" : "Already have an account? Login",
                style: TextStyle(color: Colors.blueAccent),
              ),
            ),
          ],
        ),
      ),
    ),
  );
  }
}