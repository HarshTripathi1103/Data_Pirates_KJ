// import 'package:flutter/material.dart';
// import 'package:appwrite/appwrite.dart';

// class AppwriteService {
//   static final Client client = Client()
//     .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
//     .setProject('679bbc46002356ed5151');
    
//   static final Account account = Account(client);
// }

// class LoginPage extends StatefulWidget {
//   const LoginPage({super.key});

//   @override
//   State<LoginPage> createState() => _LoginPageState();
// }

// class _LoginPageState extends State<LoginPage> {
//   final _formKey = GlobalKey<FormState>();
//   final _emailController = TextEditingController();
//   final _passwordController = TextEditingController();
//   bool _isPasswordVisible = false;
//   bool _isLoading = false;

//   @override
//   void dispose() {
//     _emailController.dispose();
//     _passwordController.dispose();
//     super.dispose();
//   }

//   Future<void> _handleLogin() async {
//   if (_formKey.currentState!.validate()) {
//     setState(() => _isLoading = true);
//     try {
//       await AppwriteService.account.createSession(
//          userId: _emailController.text,
//          secret : _passwordController.text,
//       );
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Login successful!')),
//         );
//       }
//     } catch (e) {
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text('Login failed: ${e.toString()}')),
//         );
//       }
//     } finally {
//       if (mounted) {
//         setState(() => _isLoading = false);
//       }
//     }
//   }
// }


//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: SafeArea(
//         child: Center(
//           child: SingleChildScrollView(
//             padding: const EdgeInsets.all(24.0),
//             child: Form(
//               key: _formKey,
//               child: Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 crossAxisAlignment: CrossAxisAlignment.stretch,
//                 children: [
//                   const Text(
//                     'Welcome Back',
//                     style: TextStyle(
//                       fontSize: 32,
//                       fontWeight: FontWeight.bold,
//                     ),
//                     textAlign: TextAlign.center,
//                   ),
//                   const SizedBox(height: 40),
//                   TextFormField(
//                     controller: _emailController,
//                     keyboardType: TextInputType.emailAddress,
//                     decoration: const InputDecoration(
//                       labelText: 'Email',
//                       prefixIcon: Icon(Icons.email_outlined),
//                     ),
//                     validator: (value) {
//                       if (value == null || value.isEmpty) {
//                         return 'Please enter your email';
//                       }
//                       if (!value.contains('@')) {
//                         return 'Please enter a valid email';
//                       }
//                       return null;
//                     },
//                   ),
//                   const SizedBox(height: 16),
//                   TextFormField(
//                     controller: _passwordController,
//                     obscureText: !_isPasswordVisible,
//                     decoration: InputDecoration(
//                       labelText: 'Password',
//                       prefixIcon: const Icon(Icons.lock_outline),
//                       suffixIcon: IconButton(
//                         icon: Icon(
//                           _isPasswordVisible
//                               ? Icons.visibility_off
//                               : Icons.visibility,
//                         ),
//                         onPressed: () {
//                           setState(() {
//                             _isPasswordVisible = !_isPasswordVisible;
//                           });
//                         },
//                       ),
//                     ),
//                     validator: (value) {
//                       if (value == null || value.isEmpty) {
//                         return 'Please enter your password';
//                       }
//                       if (value.length < 8) {
//                         return 'Password must be at least 8 characters';
//                       }
//                       return null;
//                     },
//                   ),
//                   const SizedBox(height: 24),
//                   ElevatedButton(
//                     onPressed: _isLoading ? null : _handleLogin,
//                     style: ElevatedButton.styleFrom(
//                       padding: const EdgeInsets.symmetric(vertical: 16),
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(12),
//                       ),
//                     ),
//                     child: _isLoading
//                         ? const CircularProgressIndicator()
//                         : const Text(
//                             'Login',
//                             style: TextStyle(fontSize: 16),
//                           ),
//                   ),
//                   const SizedBox(height: 16),
//                   TextButton(
//                     onPressed: _isLoading
//                         ? null
//                         : () {
//                             Navigator.push(
//                               context,
//                               MaterialPageRoute(
//                                 builder: (context) => const SignupPage(),
//                               ),
//                             );
//                           },
//                     child: const Text("Don't have an account? Sign up"),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// class SignupPage extends StatefulWidget {
//   const SignupPage({super.key});

//   @override
//   State<SignupPage> createState() => _SignupPageState();
// }

// class _SignupPageState extends State<SignupPage> {
//   final _formKey = GlobalKey<FormState>();
//   final _nameController = TextEditingController();
//   final _emailController = TextEditingController();
//   final _passwordController = TextEditingController();
//   final _confirmPasswordController = TextEditingController();
//   bool _isPasswordVisible = false;
//   bool _isConfirmPasswordVisible = false;
//   bool _isLoading = false;

//   @override
//   void dispose() {
//     _nameController.dispose();
//     _emailController.dispose();
//     _passwordController.dispose();
//     _confirmPasswordController.dispose();
//     super.dispose();
//   }
// Future<void> _handleSignup() async {
//   if (_formKey.currentState!.validate()) {
//     setState(() => _isLoading = true);
//     try {
//       // Create account
//       await AppwriteService.account.create(
//         userId: ID.unique(),
//         email: _emailController.text,
//         password: _passwordController.text,
//         name: _nameController.text,
//       );
      
//       // Login after successful signup
//       await AppwriteService.account.createSession(
//         userId: _emailController.text,
//         secret: _passwordController.text, 
       
//       );
      
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Account created successfully!')),
//         );
//         Navigator.of(context).pop(); // Return to login page
//       }
//     } catch (e) {
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text('Signup failed: ${e.toString()}')),
//         );
//       }
//     } finally {
//       if (mounted) {
//         setState(() => _isLoading = false);
//       }
//     }
//   }
// }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Sign Up'),
//       ),
//       body: SafeArea(
//         child: Center(
//           child: SingleChildScrollView(
//             padding: const EdgeInsets.all(24.0),
//             child: Form(
//               key: _formKey,
//               child: Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 crossAxisAlignment: CrossAxisAlignment.stretch,
//                 children: [
//                   const Text(
//                     'Create Account',
//                     style: TextStyle(
//                       fontSize: 32,
//                       fontWeight: FontWeight.bold,
//                     ),
//                     textAlign: TextAlign.center,
//                   ),
//                   const SizedBox(height: 40),
//                   TextFormField(
//                     controller: _nameController,
//                     decoration: const InputDecoration(
//                       labelText: 'Full Name',
//                       prefixIcon: Icon(Icons.person_outline),
//                     ),
//                     validator: (value) {
//                       if (value == null || value.isEmpty) {
//                         return 'Please enter your name';
//                       }
//                       return null;
//                     },
//                   ),
//                   const SizedBox(height: 16),
//                   TextFormField(
//                     controller: _emailController,
//                     keyboardType: TextInputType.emailAddress,
//                     decoration: const InputDecoration(
//                       labelText: 'Email',
//                       prefixIcon: Icon(Icons.email_outlined),
//                     ),
//                     validator: (value) {
//                       if (value == null || value.isEmpty) {
//                         return 'Please enter your email';
//                       }
//                       if (!value.contains('@')) {
//                         return 'Please enter a valid email';
//                       }
//                       return null;
//                     },
//                   ),
//                   const SizedBox(height: 16),
//                   TextFormField(
//                     controller: _passwordController,
//                     obscureText: !_isPasswordVisible,
//                     decoration: InputDecoration(
//                       labelText: 'Password',
//                       prefixIcon: const Icon(Icons.lock_outline),
//                       suffixIcon: IconButton(
//                         icon: Icon(
//                           _isPasswordVisible
//                               ? Icons.visibility_off
//                               : Icons.visibility,
//                         ),
//                         onPressed: () {
//                           setState(() {
//                             _isPasswordVisible = !_isPasswordVisible;
//                           });
//                         },
//                       ),
//                     ),
//                     validator: (value) {
//                       if (value == null || value.isEmpty) {
//                         return 'Please enter a password';
//                       }
//                       if (value.length < 8) {
//                         return 'Password must be at least 8 characters';
//                       }
//                       return null;
//                     },
//                   ),
//                   const SizedBox(height: 16),
//                   TextFormField(
//                     controller: _confirmPasswordController,
//                     obscureText: !_isConfirmPasswordVisible,
//                     decoration: InputDecoration(
//                       labelText: 'Confirm Password',
//                       prefixIcon: const Icon(Icons.lock_outline),
//                       suffixIcon: IconButton(
//                         icon: Icon(
//                           _isConfirmPasswordVisible
//                               ? Icons.visibility_off
//                               : Icons.visibility,
//                         ),
//                         onPressed: () {
//                           setState(() {
//                             _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
//                           });
//                         },
//                       ),
//                     ),
//                     validator: (value) {
//                       if (value == null || value.isEmpty) {
//                         return 'Please confirm your password';
//                       }
//                       if (value != _passwordController.text) {
//                         return 'Passwords do not match';
//                       }
//                       return null;
//                     },
//                   ),
//                   const SizedBox(height: 24),
//                   ElevatedButton(
//                     onPressed: _isLoading ? null : _handleSignup,
//                     style: ElevatedButton.styleFrom(
//                       padding: const EdgeInsets.symmetric(vertical: 16),
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(12),
//                       ),
//                     ),
//                     child: _isLoading
//                         ? const CircularProgressIndicator()
//                         : const Text(
//                             'Sign Up',
//                             style: TextStyle(fontSize: 16),
//                           ),
//                   ),
//                   const SizedBox(height: 16),
//                   TextButton(
//                     onPressed: _isLoading ? null : () => Navigator.pop(context),
//                     child: const Text('Already have an account? Login'),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// // void main() {
// //   runApp(MaterialApp(
// //     title: 'Auth App',
// //     theme: ThemeData(
// //       primarySwatch: Colors.blue,
// //       inputDecorationTheme: InputDecorationTheme(
// //         filled: true,
// //         fillColor: Colors.grey[200],
// //         border: OutlineInputBorder(
// //           borderRadius: BorderRadius.circular(12),
// //           borderSide: BorderSide.none,
// //         ),
// //       ),
// //     ),
// //     home: const LoginPage(),
// //   ));
// // }
// // import 'package:flutter/material.dart';
// // import 'package:appwrite/appwrite.dart';
// // import 'package:appwrite/models.dart' as models;

// // class AuthPage extends StatefulWidget {
// //   final Account account;

// //   const AuthPage({Key? key, required this.account}) : super(key: key);

// //   @override
// //   _AuthPageState createState() => _AuthPageState();
// // }

// // class _AuthPageState extends State<AuthPage> {
// //   models.User? loggedInUser;
// //   final TextEditingController emailController = TextEditingController();
// //   final TextEditingController passwordController = TextEditingController();
// //   final TextEditingController nameController = TextEditingController();

// //   void showError(String message) {
// //     ScaffoldMessenger.of(context).showSnackBar(
// //       SnackBar(content: Text(message), backgroundColor: Colors.red),
// //     );
// //   }

// //   Future<void> login(String email, String password) async {
// //     if (email.isEmpty || password.isEmpty) {
// //       showError('Email and password cannot be empty');
// //       return;
// //     }
// //     try {
// //       await widget.account.createEmailPasswordSession(email: email, password: password);
// //       final user = await widget.account.get();
// //       setState(() {
// //         loggedInUser = user;
// //       });
// //     } catch (e) {
// //       showError('Login failed: ${e.toString()}');
// //     }
// //   }

// //   Future<void> register(String email, String password, String name) async {
// //     if (email.isEmpty || password.isEmpty || name.isEmpty) {
// //       showError('All fields are required');
// //       return;
// //     }
// //     try {
// //       await widget.account.create(
// //           userId: ID.unique(), email: email, password: password, name: name);
// //       await login(email, password);
// //     } catch (e) {
// //       showError('Registration failed: ${e.toString()}');
// //     }
// //   }

// //   Future<void> logout() async {
// //     try {
// //       await widget.account.deleteSession(sessionId: 'current');
// //       setState(() {
// //         loggedInUser = null;
// //       });
// //     } catch (e) {
// //       showError('Logout failed: ${e.toString()}');
// //     }
// //   }

// //   @override
// //   Widget build(BuildContext context) {
// //     return Scaffold(
// //       appBar: AppBar(title: Text('Authentication')),
// //       body: Padding(
// //         padding: const EdgeInsets.all(16.0),
// //         child: Column(
// //           crossAxisAlignment: CrossAxisAlignment.start,
// //           children: <Widget>[
// //             Text(loggedInUser != null
// //                 ? 'Logged in as ${loggedInUser!.name}'
// //                 : 'Not logged in'),
// //             SizedBox(height: 16.0),
// //             TextField(
// //               controller: emailController,
// //               decoration: InputDecoration(labelText: 'Email'),
// //             ),
// //             SizedBox(height: 16.0),
// //             TextField(
// //               controller: passwordController,
// //               decoration: InputDecoration(labelText: 'Password'),
// //               obscureText: true,
// //             ),
// //             SizedBox(height: 16.0),
// //             TextField(
// //               controller: nameController,
// //               decoration: InputDecoration(labelText: 'Name'),
// //             ),
// //             SizedBox(height: 16.0),
// //             Row(
// //               mainAxisAlignment: MainAxisAlignment.start,
// //               children: <Widget>[
// //                 ElevatedButton(
// //                   onPressed: () {
// //                     login(emailController.text, passwordController.text);
// //                   },
// //                   child: Text('Login'),
// //                 ),
// //                 SizedBox(width: 16.0),
// //                 ElevatedButton(
// //                   onPressed: () {
// //                     register(emailController.text, passwordController.text,
// //                         nameController.text);
// //                   },
// //                   child: Text('Register'),
// //                 ),
// //                 SizedBox(width: 16.0),
// //                 ElevatedButton(
// //                   onPressed: () {
// //                     logout();
// //                   },
// //                   child: Text('Logout'),
// //                 ),
// //               ],
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }
// // }
