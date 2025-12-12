import * as vscode from "vscode";

function transform(input: string): string {
  // 2) <과 >를 포함하여 <...> 제거
  let s = input.replace(/<[^>]*>/g, "");

  // 3) &lt;br&gt; 를 개행으로
  s = s.replace(/&lt;br\s*\/?&gt;/gi, "\n");

  // 4) &lt;i&gt; / &lt;/i&gt; 를 * 로
  s = s.replace(/&lt;\/?i&gt;/gi, "*");

  // 5) &lt;b&gt; / &lt;/b&gt; 를 ** 로
  s = s.replace(/&lt;\/?b&gt;/gi, "**");

  // 6) 탭 문자 제거
  s = s.replace(/\t+/g, "");

  return s;
}


export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "bg3Book.cleanSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const doc = editor.document;
      const selections = editor.selections;

      // 선택이 없으면 현재 커서 라인 전체 대상으로
      const effectiveSelections =
        selections.length === 1 && selections[0].isEmpty
          ? [new vscode.Selection(selections[0].active.with(undefined, 0),
                                 selections[0].active.with(undefined, doc.lineAt(selections[0].active.line).text.length))]
          : selections;

      await editor.edit((editBuilder) => {
        for (const sel of effectiveSelections) {
          const original = doc.getText(sel);
          const changed = transform(original);
          editBuilder.replace(sel, changed);
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
