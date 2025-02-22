
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              loggedInUser != null
                  ? 'Logged in as ${loggedInUser!.name}'
                  : 'Not logged in',
              style: TextStyle(fontSize: 18),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: nameController,
              decoration: InputDecoration(labelText: 'Name'),
            ),
            SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                ElevatedButton(
                  onPressed: () {
                    login(emailController.text, passwordController.text);
                  },
                  child: Text('Login'),
                ),
                SizedBox(width: 16.0),
                ElevatedButton(
                  onPressed: () {
                    register(emailController.text, passwordController.text,
                        nameController.text);
                  },
                  child: Text('Register'),
                ),
                SizedBox(width: 16.0),
                ElevatedButton(
                  onPressed: logout,
                  child: Text('Logout'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}