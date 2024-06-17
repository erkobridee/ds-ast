[⬅️ README](../../README.md)

# ts-parser-from-scratch

TypeScript implementation of: _**Building a Parser from scratch**_

- Project template: [[GitHub] erkobridee/vitest-ts](https://github.com/erkobridee/vitest-ts)

## Commands

### Setup

```
npm i
```

### Single execution

> to check the output at the terminal

#### Lexer

```
npm run lexer
```

#### Parser

```
npm run parser
```

### Development

> start the vitest environment

```
npm start

or

npm run test
```

## Documentation

## Token

- [Token.ts](src/lexer/Token.ts) - defines the token data structure and the token identification rules (specs, which uses regexp)

## Lexer

- [Lexer.ts](src/lexer/Lexer.ts) - produce tokens

## Parser

- [AST.ts](src/parser/AST.ts) - define the AST nodes and its factory helpers

- [Parser.ts](src/parser/Parser.ts) - from a given source, produces the AST

## References

- [Regular expression syntax cheatsheet - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet)

- [EBNF: How to describe the grammar of a language](https://tomassetti.me/ebnf/)

- [Building a Parser from scratch | Dmitry Soshnikov](http://dmitrysoshnikov.com/courses/parser-from-scratch/) (2020/12/13) - [Udemy Course](https://www.udemy.com/course/parser-from-scratch/) | [Teachable](https://www.dmitrysoshnikov.education/p/parser-from-scratch/)

  - [[GitHub] letter-rdp-source](https://github.com/DmitrySoshnikov/letter-rdp-source) - Building a Parser from scratch

  - [[GitHub] AttackOnMorty/rdp](https://github.com/AttackOnMorty/rdp) - Recursive Descent Parser

- [[YouTube Playlist] Building a Parser from scratch | Dmitry Soshnikov](https://www.youtube.com/playlist?list=PLGNbPb3dQJ_5FTPfFIg28UxuMpu7k0eT4)

  - [[YouTube] Tokenizer / Parser | Dmitry Soshnikov](https://www.youtube.com/watch?v=4m7ubrdbWQU) (2020/11/12)

  - [[YouTube] Numbers / Strings | Dmitry Soshnikov](https://www.youtube.com/watch?v=0ZDPvdp2uFk) (2020/11/14)

  - [[YouTube] From State Machines to Regular Expressions | Dmitry Soshnikov](https://www.youtube.com/watch?v=nexKgX2d7wU) (2020/11/16)

  - [[YouTube] Binary Expressions | Dmitry Soshnikov](https://www.youtube.com/watch?v=nexKgX2d7wU) (2020/12/03)
