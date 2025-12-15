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

function getEffectiveSelections(
  editor: vscode.TextEditor
): vscode.Selection[] {
  const { selections, document } = editor;

  if (selections.length === 1 && selections[0].isEmpty) {
    const { active } = selections[0];
    return [
      new vscode.Selection(
        active.with(undefined, 0),
        active.with(undefined, document.lineAt(active.line).text.length)
      ),
    ];
  }

  return [...selections];
}

export function activate(context: vscode.ExtensionContext) {
  const cleanSelection = vscode.commands.registerCommand(
    "bg3Book.cleanSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const doc = editor.document;
      const effectiveSelections = getEffectiveSelections(editor);

      await editor.edit((editBuilder) => {
        for (const sel of effectiveSelections) {
          const original = doc.getText(sel);
          const changed = transform(original);
          editBuilder.replace(sel, changed);
        }
      });
    }
  );

  const copyCleanSelection = vscode.commands.registerCommand(
    "bg3Book.copyCleanSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const doc = editor.document;
      const effectiveSelections = getEffectiveSelections(editor);
      const cleaned = effectiveSelections.map((sel) =>
        transform(doc.getText(sel))
      );

      await vscode.env.clipboard.writeText(cleaned.join("\n"));
      vscode.window.showInformationMessage(
        "Cleaned text copied to clipboard."
      );
    }
  );

  context.subscriptions.push(cleanSelection, copyCleanSelection);
}

export function deactivate() {}
