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
    const [ outputContent,setOutputContent] = useState('');
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

    const compileAndRun = async () => {
      setIsRunning(true);
      setOutputContent('');

      try{
        const currerntCode = editorCoentent[fileName];
        const compiledCode = Babel.transform(currerntCode,{
          presets: ['env'],
          filename: fileName,
          sourceType: 'script'
      }).code;

      const workerCode = `
         self.console = {
            log: (...arge) => self.postMessage({type: 'log' , data: args}),
            error: (...args) => self.postMessage({type: 'error', data: args})
            warn: (...args) => self.postMessage({type: 'warn', data: args})

            try {
          ${compiledCode}
        } catch (error) {
          self.postMessage({ type: 'error', data: [error.message] });
        }

        self.postMessage({ type: 'done' });
         }  
    `;

    const blob = new Blob([workerCode], {type: 'application/javascript'});
    const worker = new Worker(URL.createObjectURL(blob));

    const timeout = setTimeout(() => {
      worker.terminate();
      setOutputContent('Code execution time out!');
      setIsRunning(false);
    },5000);

    worker.onmessage = (e) => {
      const {type,data} = e.data;
      if(type === "done"){
        clearTimeout(timeout);
        setIsRunning(false);
        return;
      }

      const prefix = type === 'error' ? 'Error:' :type === 'warn' ? 'Warning:' : '';
      setOutputContent(prev => prev + prefix + data.join(' ') + '\n');
    }

    worker.onerror = (error) => {
      clearTimeout(timeout);
      worker.terminate();
      setOutputContent(prev => prev + "Error: ${error.message}\n");
     setIsRunning(false); 
    }
  } catch (error) {
    setOutputContent('Compilation Error: ${error.message}');
    setIsRunning(false);
  }
}

  const file = files[fileName];

  return(
    <div className="h-screen bg-gray-900 text-gray-300 flex">
      <div className="flex">
        <div className="w-12 bg-gray-900 border-r border-gray-700">

        </div>

      </div>

    </div>
  )

}