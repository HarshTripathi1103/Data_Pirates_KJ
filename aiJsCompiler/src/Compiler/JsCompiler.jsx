import React, { useState,useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Code, Settings, ChevronLeft,ChevronRight, Play, Plus, X, Trash2 } from "lucide-react";
import * as Babel from '@babel/standalone';
;
const availableThemes = {
  'vs-dark': 'Dark (Default)',
  'light': 'Light',
  'Monokai': 'Monokai',
  "GitHub-Dark": "Github Dark",
  'Dracula': 'Dracula',
  'Solarized-dark': 'Solarized Dark',
  'Solarized-light': 'Solarized Light',
  'Nord': 'Nord',
  "Xcode-default": "Xcode",
};

const Loader = () => (
  <div className="flex items-center justify-center space-x-2 animate-pulse">
    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animation-delay-200"></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animation-delay-400"></div>
  </div>
);

const JsCompiler = () => {
  const [theme, setTheme] = useState('vs-dark');
  const [files, setFiles] = useState({
    'script.js': {
      name: 'script.js',
      language: 'javascript',
      icon: <Code className="w-4 h-4" />,
      value: `// Modern JavaScript features are supported!
const greet = (name = "World") => {
  console.log(\`Hello \${name}!\`);
};

greet("Developer");`,
    }
  });
  const handleThemeChange = (newTheme) => {
    if (newTheme === 'vs-dark' || newTheme === 'light') {
      setTheme(newTheme);
      return;
    }

    // Load theme from local themes folder
    fetch(`/themes/${newTheme}.json`)
      .then(data => data.json())
      .then(data => {
        window.monaco.editor.defineTheme(newTheme, data);
        window.monaco.editor.setTheme(newTheme);
        setTheme(newTheme);
      })
      .catch(error => {
        console.error('Error loading theme:', error);
        setTheme('vs-dark'); // Fallback to default theme
      });
  };

  // Effect to handle initial theme
  useEffect(() => {
    handleThemeChange(theme);
  }, []);



  const [openFiles, setOpenFiles] = useState(['script.js']);
  const [fileName, setFileName] = useState('script.js');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [editorContent, setEditorContent] = useState({
    'script.js': files['script.js'].value
  });
  const [outputContent, setOutputContent] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value) => {
    setEditorContent(prev => ({
      ...prev,
      [fileName]: value
    }));
  };

  const createNewFile = () => {
    if (!newFileName) return;
    
    const fullFileName = newFileName + '.js';
    
    if (files[fullFileName]) {
      alert('File already exists!');
      return;
    }

    const newFile = {
      name: fullFileName,
      language: 'javascript',
      icon: <Code className="w-4 h-4" />,
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

    setOpenFiles(prev => [...prev, fullFileName]);
    setFileName(fullFileName);
    setNewFileName('');
    setIsNewFileModalOpen(false);
  };

  const closeFile = (name) => {
    if (openFiles.length === 1) {
      alert('Cannot close the last file');
      return;
    }

    const newOpenFiles = openFiles.filter(f => f !== name);
    setOpenFiles(newOpenFiles);
    
    if (fileName === name) {
      setFileName(newOpenFiles[newOpenFiles.length - 1]);
    }
  };

  const deleteFile = (name) => {
    if (Object.keys(files).length === 1) {
      alert('Cannot delete the last file');
      return;
    }

    const newFiles = { ...files };
    delete newFiles[name];
    setFiles(newFiles);

    const newEditorContent = { ...editorContent };
    delete newEditorContent[name];
    setEditorContent(newEditorContent);

    if (openFiles.includes(name)) {
      closeFile(name);
    }
  };

  const compileAndRun = async () => {
    setIsRunning(true);
    setOutputContent(''); 

    try {

      const currentCode = editorContent[fileName];

      const compiledCode = Babel.transform(currentCode, {
        presets: ['env'],
        filename: fileName,
        sourceType: 'script',
      }).code;

      const workerCode = `
        self.console = {
          log: (...args) => self.postMessage({ type: 'log', data: args }),
          error: (...args) => self.postMessage({ type: 'error', data: args }),
          warn: (...args) => self.postMessage({ type: 'warn', data: args })
        };

        try {
          ${compiledCode}
        } catch (error) {
          self.postMessage({ type: 'error', data: [error.message] });
        }

        self.postMessage({ type: 'done' });
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      const timeout = setTimeout(() => {
        worker.terminate();
        setOutputContent(prev => prev + 'Error: Execution timed out (5 second limit)\n');
        setIsRunning(false);
      }, 5000);

      worker.onmessage = (e) => {
        const { type, data } = e.data;

        if (type === 'done') {
          clearTimeout(timeout);
          worker.terminate();
          setIsRunning(false);
          return;
        }

        const prefix = type === 'error' ? 'Error: ' : type === 'warn' ? 'Warning: ' : '';
        setOutputContent(prev => prev + prefix + data.join(' ') + '\n');
      };

      worker.onerror = (error) => {
        clearTimeout(timeout);
        worker.terminate();
        setOutputContent(prev => prev + `Error: ${error.message}\n`);
        setIsRunning(false);
      };

    } catch (error) {
      setOutputContent(`Compilation Error: ${error.message}\n`);
      setIsRunning(false);
    }
  };

  const file = files[fileName];

  return (
    <div className="h-screen bg-gray-900 text-gray-300 flex flex-col">
        <div className="bg-gray-800 border-b border-gray-700 h-20">
        <div className="flex justify-between items-center px-4 h-20">
        <div className="flex items-center">
          <svg viewBox="0 0 240 50" className="h-10 w-48">
            <rect x="10" y="10" width="30" height="30" rx="4" fill="#F7DF1E"/>
            <text x="17" y="32" fontFamily="monospace" fontSize="20" fontWeight="bold" fill="#000000">
              JS
            </text>
            <defs>
              <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#60A5FA'}}/>
                <stop offset="100%" style={{stopColor: '#93C5FD'}}/>
              </linearGradient>
            </defs>
            <text x="50" y="32" fontFamily="system-ui" fontSize="24" fontWeight="bold" fill="url(#text-gradient)">
              Compiler
            </text>
            <text x="150" y="32" fontFamily="system-ui" fontSize="18" fill="#94A3B8">
              .tech
            </text>
          </svg>
        </div>
          <div className="flex-1 mx-8">
            <div className=" h-10 rounded flex items-center justify-center text-gray-500">
            </div>
          </div>
          
        </div>
      </div>
    <div className="h-screen bg-gray-900 text-gray-300 flex ">
      <div className={`flex transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-76' : 'w-12'}`}>
        <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 space-y-4">
          <button className="p-2 hover:bg-gray-800 rounded transition-colors duration-200">
            <Code className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-gray-800 rounded transition-colors duration-200"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
        {isSidebarOpen && (
          <div className="w-64 bg-gray-800">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm uppercase tracking-wider">JavaScript Files</h2>
                <button 
                  onClick={() => setIsNewFileModalOpen(true)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(files).map(([key, file]) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-2 py-1 rounded ${
                      fileName === key ? 'bg-gray-700' : 'hover:bg-gray-700'
                    } transition-colors duration-200`}
                  >
                    <button
                      onClick={() => {
                        if (!openFiles.includes(key)) {
                          setOpenFiles(prev => [...prev, key]);
                        }
                        setFileName(key);
                      }}
                      className="flex items-center flex-1 text-left text-sm"
                    >
                      {file.icon}
                      <span className="ml-2">{file.name}</span>
                    </button>
                    <button
                      onClick={() => deleteFile(key)}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 flex items-center border-b border-gray-700">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-700 transition-colors duration-200"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          <div className="flex-1 flex overflow-x-auto">
            {openFiles.map(fname => (
              <button
                key={fname}
                onClick={() => setFileName(fname)}
                className={`px-4 py-2 flex items-center space-x-2 border-r border-gray-700 min-w-max group ${
                  fileName === fname ? 'bg-gray-900' : 'bg-gray-800 hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                <div className="flex items-center space-x-2">
                  {files[fname].icon}
                  <span>{fname}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(fname);
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>

          <button
            onClick={compileAndRun}
            disabled={isRunning}
            className={`px-4 py-2 flex items-center space-x-2 transition-colors duration-200 ${
              isRunning 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="rounded-lg overflow-hidden shadow-xl relative">
          <Editor
            loading={<Loader />}
            height="100%"
            theme={theme}
            path={file.name}
            defaultLanguage="javascript"
            defaultValue={file.value}
            onChange={handleEditorChange}
            value={editorContent[fileName]}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          />
          {isRunning && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
        <div className="w-full h-full bg-gray-800 text-gray-100 rounded-lg shadow-xl p-4 font-mono overflow-auto relative">
          <pre className="whitespace-pre-wrap">{outputContent}</pre>
          {isRunning && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
      </div>
     </div>

      {/* Modals */}
      {isSettingsOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-gray-700 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Theme</label>
              <select 
                value={theme} 
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full bg-gray-700 rounded p-2"
              >
                {Object.entries(availableThemes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-blue-600 hover:bg-blue-700 rounded py-2">
              Save
            </button>
          </div>
        </div>
      </div>
    )}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create New JavaScript File</h2>
              <button 
                onClick={() => setIsNewFileModalOpen(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Enter file name (without .js)"
                  className="w-full bg-gray-700 rounded p-2"
                />
              </div>
              <button 
                onClick={createNewFile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 transition-colors duration-200"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsCompiler;