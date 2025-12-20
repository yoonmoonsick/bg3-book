# BG3 Book Text Cleaner Extension

## Overview
This VS Code extension converts Baldur's Gate 3 XML-style book texts into clean Markdown format. It provides two commands: in-place cleaning and clipboard copying.

## Architecture
- **Entry Point**: `out/extension.js` (compiled from `src/extension.ts`)
- **Commands**: 
  - `bg3Book.cleanSelection`: Replaces selected text with cleaned version
  - `bg3Book.copyCleanSelection`: Copies cleaned text to clipboard
- **Core Logic**: `transform()` function performs sequential regex replacements

## Key Patterns
- **Selection Handling**: `getEffectiveSelections()` treats empty selections as full current line
- **Transform Sequence**: Applies replacements in order: remove `<...>`, convert `&lt;br&gt;` to `\n`, `&lt;i&gt;`/`&lt;/i&gt;` to `*`, `&lt;b&gt;`/`&lt;/b&gt;` to `**`, remove tabs
- **Command Registration**: Uses `vscode.commands.registerCommand` with async functions for editor operations

## Development Workflow
- **Build**: `npm run compile` (TypeScript to `out/`)
- **Watch Mode**: `npm run watch` for continuous compilation during development
- **Testing**: Basic Mocha setup in `src/test/extension.test.ts` (sample tests only)
- **Linting**: ESLint with TypeScript rules (naming conventions, curly braces, etc.)

## Code Examples
**Adding a new text transformation**:
```typescript
function transform(input: string): string {
  let s = input.replace(/<[^>]*>/g, "");
  // Add new replacement here
  s = s.replace(/newpattern/g, "replacement");
  return s;
}
```
Reference: [src/extension.ts](src/extension.ts#L3-L15)

**Registering a new command**:
```typescript
const newCommand = vscode.commands.registerCommand("bg3Book.newCommand", async () => {
  // Command logic
});
context.subscriptions.push(newCommand);
```
Reference: [src/extension.ts](src/extension.ts#L32-L50)

## Conventions
- HTML entities use `&lt;`/`&gt;` in patterns (e.g., `&lt;br&gt;`)
- Regex flags: `g` for global, `i` for case-insensitive where needed
- Async commands for clipboard/editor operations
- Single file structure with exported `activate`/`deactivate` functions