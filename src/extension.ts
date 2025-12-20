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

  const effectiveSelections: vscode.Selection[] = [];

  for (const selection of selections) {
    if (selection.isEmpty) {
      // 커서만 있을 때: 현재 행 전체
      const { active } = selection;
      effectiveSelections.push(
        new vscode.Selection(
          active.with(undefined, 0),
          active.with(undefined, document.lineAt(active.line).text.length)
        )
      );
    } else {
      // 선택이 있을 때
      const startLine = selection.start.line;
      const endLine = selection.end.line;

      if (startLine === endLine) {
        // 블록이 한 행 안에 있을 때: 그 행 전체
        effectiveSelections.push(
          new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(startLine, document.lineAt(startLine).text.length)
          )
        );
      } else {
        // 블록이 여러 행에 걸쳐 있을 때: 각 행 전체
        for (let line = startLine; line <= endLine; line++) {
          effectiveSelections.push(
            new vscode.Selection(
              new vscode.Position(line, 0),
              new vscode.Position(line, document.lineAt(line).text.length)
            )
          );
        }
      }
    }
  }

  return effectiveSelections;
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
