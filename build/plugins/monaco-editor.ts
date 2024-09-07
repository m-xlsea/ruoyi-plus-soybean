import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export function setupMonacoEditorPlugin() {
  return (monacoEditorPlugin as any).default({
    languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript']
  });
}
