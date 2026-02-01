import * as vscode from "vscode";

function transform(input: string): string {
  // 기존의 transform 함수 내용 유지
  let s = input.replace(/<[^>]*>/g, "");
  s = s.replace(/&lt;br\s*\/?&gt;/gi, "\n");
  s = s.replace(/&lt;\/?i&gt;/gi, "*");
  s = s.replace(/&lt;\/?b&gt;/gi, "**");
  s = s.replace(/\t+/g, "");
  return s;
}

function getEffectiveSelections(
  editor: vscode.TextEditor
): vscode.Selection[] {
  // 기존의 getEffectiveSelections 함수 내용 유지
  const { selections, document } = editor;
  const effectiveSelections: vscode.Selection[] = [];
  
  for (const selection of selections) {
    if (selection.isEmpty) {
      const { active } = selection;
      effectiveSelections.push(
        new vscode.Selection(
          active.with(undefined, 0),
          active.with(undefined, document.lineAt(active.line).text.length)
        )
      );
    } else {
      const startLine = selection.start.line;
      const endLine = selection.end.line;

      if (startLine === endLine) {
        effectiveSelections.push(
          new vscode.Selection(
            new vscode.Position(startLine, 0),
            new vscode.Position(startLine, document.lineAt(startLine).text.length)
          )
        );
      } else {
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

// 새로 추가된 showAlert 함수
function showAlert(message: string) {
  return vscode.window.showInformationMessage(message);
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

      // 작업 완료 후 알림 표시
      showAlert("텍스트 정리가 완료되었습니다.");
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
      
      // 복사 완료 후 알림 표시
      showAlert("정리된 텍스트가 클립보드에 복사되었습니다.");
    }
  );

  context.subscriptions.push(cleanSelection, copyCleanSelection);
}

export function deactivate() {}