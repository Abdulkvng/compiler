import React, { useState } from 'react';
import { Lexer } from '../lexer.js';
import { Parser } from '../parser.js';
import { Interpreter } from '../interpreter.js';

const examples = [
  `let x = 10;
while (x > 0) {
  print x;
  x = x - 1;
}`,
  `let sum = 0;
let i = 1;
while (i <= 5) {
  sum = sum + i;
  i = i + 1;
}
print "Sum is:";
print sum;`,
  `let x = 5;
if (x > 3) {
  print "x is greater than 3";
} else {
  print "x is less than or equal to 3";
}`,
  `let name = "World";
print "Hello";
print name;`
];

function App() {
  const [code, setCode] = useState(examples[0]);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);

  const runCode = () => {
    try {
      setOutput([]);
      setError(null);

      // Override console.log to capture output
      const originalLog = console.log;
      console.log = (...args) => {
        setOutput(prev => [...prev, args.join(' ')]);
      };

      const lexer = new Lexer(code);
      const parser = new Parser(lexer);
      const interpreter = new Interpreter();
      
      const tree = parser.parse();
      interpreter.interpret(tree);

      // Restore console.log
      console.log = originalLog;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Tiny Programming Language
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Code Editor
                </label>
                <textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your code here..."
                />
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={runCode}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Run Code
                  </button>
                  <div className="text-sm text-gray-500">
                    Press Run to execute the code
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Output</h3>
                <div className="bg-gray-50 rounded-md p-4 h-96 overflow-y-auto font-mono text-sm">
                  {output.map((line, index) => (
                    <div key={index} className="text-gray-800">{line}</div>
                  ))}
                  {error && (
                    <div className="text-red-600 mt-2">Error: {error}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setCode(example)}
                    className="text-left p-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                      {example.split('\n').slice(0, 3).join('\n')}
                      {example.split('\n').length > 3 ? '\n...' : ''}
                    </pre>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;