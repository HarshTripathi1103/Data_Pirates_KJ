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

    const [openFiles,setOpenFiles] = useState(['script.js']);
    const [fileName,setFileName] = useState('script.js');
    const [isSidebarOpen,setIsSideBarOpen] = useState(true);
    const [editorCoentent,setEditorContent] = useState({
      'script.js': files['script.js.js'].value
    });
    const [ outputrContent,setOutputContent] = useState('');
    const [theme,setTheme] = useState('vs-dark');
    const [isSettingOpen,setIsSettingOpen] = useState(false);
    const [isNewFileModelOpen,setIsNewFileModelOpen] = useState(false);
    const [newFileName,setNewFileName] = useState('');
    const [isRunning,setIsRunning] = useState(false);

    const handleEditorChange = (value) => {
     setEditorContent(prev => ({
      ...prev,
      [fileName]: value
     }))
    };

    const createNewFile = () => {
      if(!newFileName) return;

      const fullFileName = newFileName.endsWith('.js') ? newFileName : `${newFileName}.js`;

      if(files[fullFileName]) {
        alert('File already exists!');
        return;
      }

      const newFile = {
        name: fullFileName,
        language: 'javascript',
        icon: <Code className="w-4 h-4"/>,
        value: ''
      };

      setFiles(prev => ({
        ...prev,
        [fullFileName]: newFile
      }));

      setEditorContent(prev => ({
        ...prev,
        [fullFileName]: ''
      }));

      setOpenFiles(prev => [...prev,fullFileName]);
      setFileName(fullFileName);
      setNewFileName('');
      setIsNewFileModelOpen(false);
    }

    const closeFile = (name) => {
      if(openFiles.length === 1){
        alert('You can not close the last file!');
        return;
      }
      const newOpenFiles = openFiles.filter(f => f !== name);
    setOpenFiles(newOpenFiles);

    if(fileName === name){
      setFileName(newOpenFiles[newOpenFiles.length - 1]);
    }
    }

    const deleteFiles = (name) => {
      if(Object.keys(files).length === 1){
        alert('You can not delete the last file!');
        return;
      }
      const newFiles = {...files};
      delete newFiles[name];
      setFiles(newFiles);

      const newEditorContent = {...editorCoentent};
      delete newEditorContent[name];
      setEditorContent(newEditorContent);

      if(openFiles.includes(name)){
        closeFile(name);
      }
    }

}