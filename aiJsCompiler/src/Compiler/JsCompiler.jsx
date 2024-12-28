import React,{useState} from "react";
import Editor from "@monaco-editor/react";
import {Code,Settings, ChevronRight,Play,Plus,X,Trash2} from "lucide-react";
import * as Babel from "@babel/standalone";

const JSCompiler = () => {
  const [files,setFiles] = useState({
    'script.js': {
      name: 'script.js',
      language: 'javascript',
      icon: <Code className="w-4 h-4"/>,
      value: `// Mordern Javascript features are Supported!
      const greet =  (name ="World") => {
        console.log(\`Hello, \${name}!\`);
      }
      //Run the code
      greet("Developer");`,
    }
});

    const [openFiels,setOpenFiles] = useState(['script.js']);
    const [fileName,setFileName] = useState('script.js');
    const [isSidebarOpen,setIsSideBarOpen] = useState(true);
    const [editorCoentent,setEditorContent] = useState({
      'script.js': files['script.js.js'].value
    });
    const [ outputrContent,setOutputContent] = useState('');
    const [theme,setTheme] = useState('vs-dark');
    const [isSettingOpen,setIsSettingOpen] = useState(false);
}