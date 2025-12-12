# BG3 Book Text Cleaner

A Visual Studio Code extension that converts Baldur’s Gate 3 XML-style book, letter, and scroll texts into Markdown-friendly format by cleaning and transforming selected text.

---

## Purpose

Baldur’s Gate 3 stores in-game books, letters, and scrolls in an XML/HTML-like text format.  
This extension is designed to quickly transform those texts into a clean Markdown format suitable for documentation, modding notes, wikis, or personal archives.

The transformation is applied **only to the currently selected text**.

---

## Features

When the command is executed, the extension performs the following operations on the selected text:

- Removes all text between `<` and `>` (including the brackets)
- Converts `&lt;br&gt;` into line breaks
- Converts `&lt;i&gt;` and `&lt;/i&gt;` into `*` (Markdown italics)
- Converts `&lt;b&gt;` and `&lt;/b&gt;` into `**` (Markdown bold)
- Removes all tab characters (`\t`)

---

## Usage

1. Select a block of text in the editor
2. Open the Command Palette (`Ctrl+Shift+P`)
3. Run: **BG3: Clean Selected Text**
4. The selected text is replaced with the transformed Markdown-friendly text

---

## Typical Use Cases

- Converting BG3 book XML exports into Markdown
- Cleaning copied in-game texts for wiki or note usage
- Preparing readable documentation from game assets

---

## License

MIT

---

# BG3 텍스트 클리너

이 확장 기능은 **발더스 게이트 3**의 책, 편지, 스크롤 등에 사용되는  
**XML / HTML 유사 형식의 텍스트를 Markdown 형식으로 변환**하기 위해 제작된  
Visual Studio Code 확장 프로그램입니다.

---

## 목적

발더스 게이트 3의 게임 데이터에는 책과 문서류가 XML 형태의 텍스트로 저장되어 있습니다.  
이 확장 기능은 이러한 텍스트를 **Markdown에 적합한 깔끔한 형태로 빠르게 변환**하는 것을 목표로 합니다.

변환은 **현재 선택된 텍스트 블록에만 적용**됩니다.

---

## 기능

명령을 실행하면 선택된 텍스트에 대해 다음 작업을 수행합니다.

- `<` 와 `>`를 포함하여 `< ... >` 사이의 모든 텍스트 제거
- `&lt;br&gt;`를 줄바꿈으로 변환
- `&lt;i&gt;`, `&lt;/i&gt;`를 `*`로 변환 (Markdown 기울임)
- `&lt;b&gt;`, `&lt;/b&gt;`를 `**`로 변환 (Markdown 굵게)
- 모든 탭 문자(`\t`) 제거

---

## 사용 방법

1. 에디터에서 변환할 텍스트를 블록 선택합니다
2. 명령 팔레트 (`Ctrl+Shift+P`)를 엽니다
3. **BG3: Clean Selected Text** 명령을 실행합니다
4. 선택된 텍스트가 변환된 결과로 교체됩니다

---

## 활용 예시

- BG3 책 XML 데이터를 Markdown으로 변환
- 인게임 문서를 위키용 텍스트로 정리
- 모드 제작 및 개인 문서화 작업

---

## 라이선스

MIT
