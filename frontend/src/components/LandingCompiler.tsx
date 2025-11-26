'use client'

import { useMemo, useState } from 'react'
import {
  compilerService,
  RunCodeResponse,
} from '@/lib/compilerService'

const languages = [
  {
    id: 71,
    label: 'Python 3',
    template: `def greet(name: str) -> str:
    return f"Hello, {name}!"


if __name__ == "__main__":
    user = input().strip() or "World"
    print(greet(user))`,
  },
  {
    id: 63,
    label: 'JavaScript (Node)',
    template: `function greet(name) {
  return \`Hello, \${name}!\`
}

const fs = require('fs')
const input = fs.readFileSync(0, 'utf8').trim() || 'World'
console.log(greet(input))`,
  },
  {
    id: 62,
    label: 'Java 17',
    template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.hasNextLine() ? sc.nextLine() : "World";
        System.out.println("Hello, " + name + "!");
    }
}`,
  },
  {
    id: 54,
    label: 'C++ 17',
    template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string name;
    if (!(getline(cin, name)) || name.empty()) {
        name = "World";
    }
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`,
  },
  {
    id: 50,
    label: 'C (GCC)',
    template: `#include <stdio.h>

int main() {
    char name[100] = "World";
    fgets(name, sizeof(name), stdin);
    if (name[0] == '\\0' || name[0] == '\\n') {
        sprintf(name, "World");
    }
    printf("Hello, %s!\\n", name);
    return 0;
}`,
  },
  {
    id: 60,
    label: 'Go',
    template: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    input, _ := reader.ReadString('\\n')
    input = strings.TrimSpace(input)
    if input == "" {
        input = "World"
    }
    fmt.Printf("Hello, %s!\\n", input)
}`,
  },
]

export default function LandingCompiler() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].id)
  const [sourceCode, setSourceCode] = useState(languages[0].template)
  const [stdin, setStdin] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RunCodeResponse | null>(null)

  const languageLabel = useMemo(
    () => languages.find((lang) => lang.id === selectedLanguage)?.label,
    [selectedLanguage]
  )

  const handleLanguageChange = (languageId: number) => {
    const nextLanguage = languages.find((lang) => lang.id === languageId)
    if (!nextLanguage) return
    setSelectedLanguage(languageId)
    setSourceCode(nextLanguage.template)
    setResult(null)
    setError(null)
  }

  const handleRunCode = async () => {
    if (!sourceCode.trim()) {
      setError('Please add some code before running the compiler.')
      return
    }

    setIsRunning(true)
    setError(null)

    try {
      const response = await compilerService.runCode({
        languageId: selectedLanguage,
        sourceCode,
        stdin,
      })
      setResult(response)
    } catch (runError) {
      const message =
        runError instanceof Error
          ? runError.message
          : 'Failed to reach the compiler service.'
      setError(message)
      setResult(null)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-wrap gap-3 mb-6">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => handleLanguageChange(language.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              selectedLanguage === language.id
                ? 'bg-emerald-500 text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            type="button"
          >
            {language.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-300 uppercase tracking-widest">
              Editor
            </p>
            <span className="text-[11px] text-slate-500">
              Running on Judge0 • {languageLabel}
            </span>
          </div>
          <textarea
            className="w-full h-72 rounded-xl bg-black/60 border border-slate-800 text-sm font-mono p-4 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            value={sourceCode}
            onChange={(event) => setSourceCode(event.target.value)}
            spellCheck={false}
          />

          <div className="mt-4">
            <label className="text-xs text-slate-400 mb-1 block">
              Custom Input (STDIN)
            </label>
            <textarea
              className="w-full h-24 rounded-xl bg-black/40 border border-slate-800 text-sm font-mono p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              spellCheck={false}
              placeholder="Optional input passed to your program..."
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-300 uppercase tracking-widest">
              Output
            </p>
            <button
              className="bg-emerald-500 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-opacity disabled:opacity-50"
              onClick={handleRunCode}
              disabled={isRunning}
              type="button"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>

          <div className="flex-1 bg-black/60 border border-slate-800 rounded-xl p-4 overflow-auto">
            {error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : result ? (
              <div className="space-y-4 text-sm text-slate-100 font-mono">
                {result.status?.description && (
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-widest">
                    <span>Status</span>
                    <span className="text-emerald-400">
                      {result.status.description}
                    </span>
                  </div>
                )}
                {result.stdout && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">STDOUT</p>
                    <pre className="whitespace-pre-wrap bg-slate-900/80 rounded-lg p-3">
                      {result.stdout}
                    </pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">STDERR</p>
                    <pre className="whitespace-pre-wrap bg-slate-900/80 rounded-lg p-3 text-red-400">
                      {result.stderr}
                    </pre>
                  </div>
                )}
                {result.compile_output && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Compiler Output
                    </p>
                    <pre className="whitespace-pre-wrap bg-slate-900/80 rounded-lg p-3 text-yellow-400">
                      {result.compile_output}
                    </pre>
                  </div>
                )}
                <div className="flex gap-4 text-xs text-slate-400">
                  {result.time && <span>Time: {result.time}s</span>}
                  {typeof result.memory === 'number' && (
                    <span>Memory: {result.memory} KB</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Output will appear here once you run the code.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

