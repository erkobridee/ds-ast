# ds-ast

DS ( Data Structure ) AST (Abstract Syntax Tree)

> [!TIP]
>
> This knowledge is really useful and it helps whenever you need to process any kind text.

## Implementations

- [TypeScript implementation of: _**Building a Parser from scratch**_](./implementations/ts-parser-from-scratch/README.md)

- [TypeScript implementation of: _**XML Parser**_](./implementations/ts-parser-xml/README.md) - basic support to the XML language

## Definitions

![](assets/anatomy-compiler.png)

### Lexer

> A **lexer** transforms a sequence of characters into a sequence of tokens.
>
> A compiler **lexer** is a crucial component in the compilation process of a programming language. It is responsible for breaking down the source code into smaller, meaningful units called tokens or lexemes. These tokens are then fed into the parser, which constructs the abstract syntax tree (AST) of the program.

```ts

enum TokenType {
  TOKEN_TYPE = 'TOKEN_TYPE',
  ...
}

type TTokenSpec = [RegExp, TokenType];


/**
 * The line and column values are useful for debugging propose and also
 * to have a better error messaging that points out where the error happens
 *
 * The start and end values are useful to UI implementation that informantion
 * enables to select the given text by its start and end cursor position
 *
 * An example of the start and end cursor position to highlight text could be
 * seen at: https://astexplorer.net/
 */
interface TokenLocation {
  line: number;
  column: number;

  start: number;
  end: number;
}

interface Token {
  type: TokenType;
  lexeme: string;

  /**
   *  This information is useful for debugging and UI implementation of a code editor
   */
  location?: TokenLocation;
}

```

#### Key Features of a Compiler Lexer

- **Tokenization:** The lexer converts the source code into tokens, which are the smallest syntactic units of the language. These tokens can be identifiers, keywords, literals, operators, or other special characters.

- **Regular Expressions:** The lexer uses regular expressions to define the patterns for identifying these tokens. This approach allows for efficient and flexible token recognition.

- **State Transition Table:** The lexer can be implemented using a state transition table, which is a table-driven approach that directly jumps to follow-up states via goto statements. This approach can produce faster lexers than hand-coded ones.

### Parser

> A **parser** is a software component that takes input data (typically text) and builds a data structure, often a parse tree or abstract syntax tree (AST), giving a structural representation of the input while checking for correct syntax. It is a crucial part of the compilation process, particularly in compiler design.

#### RDP - Recursive Descent Parser

- [Recursive Descent Parser | GeeksforGeeks](https://www.geeksforgeeks.org/recursive-descent-parser/) (2023/06/09)

### AST

> An **Abstract Syntax Tree** (_AST_) is a data structure used in computer science to represent the structure of a program or code snippet. It is a tree-like representation of the source code, abstracting away the syntax and semantics of the programming language. The AST is designed to preserve essential information such as variable types, the location of each declaration, the order of executable statements, left and right components of binary operations, and identifiers and their assigned values.

## Tools

- [AST explorer](https://astexplorer.net/)

## References

### Theory

- [[YouTube Playlist] Compiler Design - Quick Concepts | Neso Academy](https://www.youtube.com/playlist?list=PLBlnK6fEyqRgfOB2fidzM9n11SQIA76_e)

- [[YouTube Playlist] Compiler Design - Chapter 1 - Introduction to Compiler Design | Neso Academy](https://www.youtube.com/playlist?list=PLBlnK6fEyqRgo_ukpWHcHzHptrnCSGteB)

- [[YouTube Playlist] Compiler Design - Chapter 2 - Syntax Analysis | Neso Academy](https://www.youtube.com/playlist?list=PLBlnK6fEyqRhMjOLYfqGdyB7Gt_k5cD6t)

- [[YouTube Playlist] Compiler Design - Chapter 3 - Top-Down Parsers | Neso Academy](https://www.youtube.com/playlist?list=PLBlnK6fEyqRgPLTKYaRhcMt8pVKl4crr6)

- [A Guide To Parsing: Algorithms And Terminology | Gabriele Tomassetti](https://tomassetti.me/guide-parsing-algorithms-terminology/) (2023/07/26)

- [Compilers Series' Articles | by Paul Lefebvre - DEV Community](https://dev.to/lefebvre/series/21363)

  - [Compilers 101 - Overview and Lexer](https://dev.to/lefebvre/compilers-101---overview-and-lexer-3i0m) (2018/01/19)

  - [Compilers 102 - Parser](https://dev.to/lefebvre/compilers-102---parser-2gni) (2018/01/22)

### The Language of languages

- [Grammar: The language of languages (BNF, EBNF, ABNF and more)](https://matt.might.net/articles/grammars-bnf-ebnf/)

#### BNF - Backus-Naur Form

- [BNF Playground](https://bnfplayground.pauliankline.com/)

- [Backus–Naur Form | Ada Computer Science](https://adacomputerscience.org/concepts/trans_bnf)

- [Backus–Naur form | Wikipedia](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)

- [4.2: Application - BNF | Engineering LibreTexts](<https://eng.libretexts.org/Bookshelves/Computer_Science/Programming_and_Computation_Fundamentals/Foundations_of_Computation_(Critchlow_and_Eck)/04%3A_Grammars/4.02%3A_Application_-_BNF>)

#### EBNF - Extended Backus-Naur Form

- [EBNF: How to describe the grammar of a language](https://tomassetti.me/ebnf/)

- [Extended Backus–Naur Form diagram | PlantUML.com](https://plantuml.com/ebnf) - EBNF is a code that expresses the syntax of a formal language. An EBNF consists of terminal symbols and non-terminal production rules.

- [ebnf-convert](https://www.bottlecaps.de/ebnf-convert/) - Grammar Converter

- [RR - Railroad Diagram Generator](https://rr.red-dove.com/ui)

  - [[GitHub] GuntherRademacher/rr](https://github.com/GuntherRademacher/rr)

- [[GitHub] matthijsgroen/ebnf2railroad](https://github.com/matthijsgroen/ebnf2railroad) - 📔 Create beautiful documentation for EBNF

  - [Try online!](https://matthijsgroen.github.io/ebnf2railroad/try-yourself.html)

- [[GitHub] kaigouthro/ebnf_live_graphviz](https://github.com/kaigouthro/ebnf_live_graphviz) - [python] streamlit w3c ebnf visualzer, json output, markdown visualizer, and live graphviz hierarchy

- [EBNF (Syntax diagrams / Railroad diagrams / Grammar diagrams) #4252 | mermaidjs / mermeid - GitHub](https://github.com/mermaid-js/mermaid/issues/4252)

- [Railroad, Syntax diagrams, EBNF | Wiki at mermaidjs / mermeid - GitHub](https://github.com/mermaid-js/mermaid/wiki/Railroad,-Syntax-diagrams,-EBNF)

#### Compiler

- [Computer Language - (Compiler|Interpreter) - Language translator | DataCadamia](https://datacadamia.com/code/compiler/compiler)

#### Lexer

- [What is a Lexer ? known also as Tokenizer or Scanner - Lexical Analysis | DataCadamia](https://datacadamia.com/code/compiler/lexer)

- [Lexical Analysis - (Token|Lexical unit|Lexeme|Symbol|Word) | DataCadamia](https://datacadamia.com/code/compiler/token)

#### Parser

- [Lexical Analysis - Parser (Syntax analysis|Linter) | DataCadamia](https://datacadamia.com/code/compiler/parser)

#### AST

- [Parser / Compiler - (Abstract) Syntax Tree (AST) | DataCadamia](https://datacadamia.com/code/compiler/ast)

- [Abstract Syntax Tree (AST) - Explained in Plain English | DEV Community](https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38) (2024/06/11) - As a developer, the source code that you write is all so concise and elegant.

- [Tree traversal | Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal)

- [[GitHub] cowchimp/awesome-ast](https://github.com/cowchimp/awesome-ast) - A curated list of awesome AST resources

### Implementation

- [BNF Notation: Dive Deeper Into Python's Grammar | Real Python](https://realpython.com/python-bnf-notation/)

- [[YouTube] LLVM in 100 Seconds | Fireship](https://www.youtube.com/watch?v=BT2Cv-Tjq7Q) (2022/05/23)

- [Writing Your Own Lexer With Simple Steps | Serhii Chornenkyi](https://serhii.io/posts/writing-your-own-lexer-with-simple-steps) (2023/11/24)

- [[YouTube Playlist] Creating a Compiler | Pixeled](https://www.youtube.com/playlist?list=PLUDlas_Zy_qC7c5tCgTMYq2idyyT241qs)

  - [[GitHub] hydrogen-cpp](https://github.com/orosmatthew/hydrogen-cpp)

- [A simple recursive descent parser | DEV Community](https://dev.to/6502/a-recursive-descent-parser-8jp) (2023/10/09)

- [[YouTube Playlist] Build a Custom Scripting Language In Typescript - Introduction to Interpreters & Compilers | tylerlaceby](https://www.youtube.com/playlist?list=PL_2VhOvlMk4UHGqYCLWc6GO8FaPl8fQTh)

  - [[GitHub] tlaceby/guide-to-interpreters-series](https://github.com/tlaceby/guide-to-interpreters-series) - Contains source-code for viewers following along with my Beginners Guide To Building Interpreters series on my Youtube Channel.

- [Let's Build A Simple Interpreter | Ruslan's Blog](https://ruslanspivak.com/lsbasi-part1/)

  - [Part 7: Abstract Syntax Trees | Ruslan's Blog](https://ruslanspivak.com/lsbasi-part7/) (2015/12/15) - [python](https://github.com/rspivak/lsbasi/blob/master/part7/python/spi.py) and [rust](https://github.com/rspivak/lsbasi/blob/master/part7/rust/spi/src/main.rs) implementations

  - [Part 13: Semantic Analysis | Ruslan's Blog](https://ruslanspivak.com/lsbasi-part13/) (2017/04/27)

- [[YouTube Playlist] Building a Compiler in JS | benwatkins10xd](https://www.youtube.com/playlist?list=PLKddWTBxzVCLRCltbWZxCyKm3IqkjEsBw)

  - [[GitHub] benwatkins10xd/js-compile](https://github.com/benwatkins10xd/js-compile) - Compiler in vanilla javascript from scratch

- [[YouTube] abstract syntax tree's are gonna be IMPORTANT in 2024 | Chris Hay](https://www.youtube.com/watch?v=vgRQREmr0rA) (2023/12/28)

  - [[GitHub] chrishayuk/typescript-parsing](https://github.com/chrishayuk/typescript-parsing)

#### ANTLR - ANother Tool for Language Recognition

- [ANTLR](https://www.antlr.org/)

  - [Playground](http://lab.antlr.org/)

    - [[GitHub] antlr/antlr4-lab](https://github.com/antlr/antlr4-lab) - A client/server for trying out and learning about ANTLR

  - [ANTLR4 grammar syntax support | Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mike-lischke.vscode-antlr4)

    - [[GitHub] mike-lischke/vscode-antlr4](https://github.com/mike-lischke/vscode-antlr4) - ANTLR4 language support for Visual Studio Code

- [[GitHub] antlr/antlr4](https://github.com/antlr/antlr4) - is a powerful parser generator for reading, processing, executing, or translating structured text or binary files.

- [[GitHub] antlr/grammars-v4](https://github.com/antlr/grammars-v4) - Grammars written for ANTLR v4; expectation that the grammars are free of actions.

- [The ANTLR Mega Tutorial | strumenta](https://tomassetti.me/antlr-mega-tutorial/)

- [Antlr - (Grammar|Lexicon) (g4) | DataCadamia](https://datacadamia.com/antlr/grammar)
