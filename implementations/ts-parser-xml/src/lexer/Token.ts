import { truncate } from '~/utils/text';
import { isObject, isString, isNumber, isUndefined } from '~/utils/check';

export interface IToken {
  type: string;
  lexeme?: string;

  // information useful for error reporting or debugging
  line?: number;
  column?: number;
}

//----------------------------------------------------------------------------//

export const tokenToString = (token: IToken, maxLexemeLength = 50): string => {
  const { type, lexeme, line, column } = token;

  let message = `Token`;
  if (line && column) message += `@[ Ln ${line}, Col ${column} ]`;
  message += `( ${type}`;
  if (lexeme) message += `, ${truncate(lexeme, maxLexemeLength)}`;
  message += ' )';

  return message;
};

export class Token implements IToken {
  public type: string;
  public lexeme?: string;
  public line?: number;
  public column?: number;

  constructor(type: string, lexeme?: string, line?: number, column?: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
    this.column = column;
  }

  public toString(maxLexemeLength = 50): string {
    return tokenToString(this, maxLexemeLength);
  }
}

//----------------------------------------------------------------------------//

export class BuildTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BuildTokenError';
  }
}

const isSecondInvalid = (value: unknown) =>
  !(isString(value) || isNumber(value) || isUndefined(value));

export const buildToken = (...args: unknown[]) => {
  if (args.length === 0) {
    throw new BuildTokenError('buildToken must have at least one argument');
  }

  const [first, second, third, fourth] = args;

  if (isObject(first)) {
    const { type, lexeme, line, column } = first as IToken;
    return new Token(type, lexeme, line, column);
  }

  if (isString(first)) {
    if (isSecondInvalid(second)) {
      throw new BuildTokenError(
        'buildToken invalid second parameter [ accepts: string | number | undefined ]'
      );
    }

    let line: undefined | number, column: undefined | number;
    if (isNumber(third)) {
      line = Number(third);
    }
    if (isNumber(fourth)) {
      column = Number(fourth);
    }

    return new Token(
      first as string,
      isString(second) ? (second as string) : undefined,
      line,
      column
    );
  }

  throw new BuildTokenError('buildToken has no valid argument');
};

//----------------------------------------------------------------------------//

export const Types = {
  SKIP: 'SKIP',

  /** end of file */
  EOF: 'EOF',
  /** end of line - `\n` on POSIX and `\r\n` on Windows */
  EOL: 'EOL',

  COMMENT: 'COMMENT',
  DTD: 'DTD',

  EXTERNAL_STYLE_SHEETS: 'EXTERNAL_STYLE_SHEETS',
  XML_DECL_START: 'XML_DECL_START',
  SPECIAL_CLOSE: 'SPECIAL_CLOSE',

  ELEMENT: 'ELEMENT',

  STRING: 'STRING',
  NAME: 'NAME',

  CDATA: 'CDATA',
  TEXT: 'TEXT',
  RAW_TEXT: 'RAW_TEXT',
} as const;

// EOF - End of File
export const buildEOFToken = (line?: number, column?: number) =>
  buildToken({
    type: Types.EOF,
    line,
    column,
  });

export const isEOF = (token: IToken) => token.type === Types.EOF;

//----------------------------------------------------------------------------//
// Specifications Map

/*
  [Gist] erkobridee/ts-use_consts_instead_of_enums.ts
  https://gist.github.com/erkobridee/576bcba33ed5fcf26c68fb0f32efdef3
*/

export const Spec = {
  /** Type: `ELEMENT` - any valid xml tag that could have attributes, content and it closes it at the end */
  Element: [
    /<(?<tag>[\w:]+)(?:(?<attributes>(\s(\w+)(?:=(?:"(.+)"|'(.+)'))?)+)|[\s\S]*?)>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    Types.ELEMENT,
  ],

  //---//

  /** Type: `EOL` */
  EndOfLine: [/^(?:\n|\r\n|\n\r)/, Types.EOL],

  /** Type: `COMMENT` */
  Comment: [/^<!--[\s\S]*?-->/, Types.COMMENT],

  //---//

  /** Type: `SKIP` */
  EmptySpaces: [/^[ \t]/, Types.SKIP],

  // external style sheets
  // https://www.w3.org/Style/styling-XML.en.html

  //---//

  // DTD
  // https://www.xmlfiles.com/dtd/
  // https://tutorialreference.com/xml/dtd/dtd-tutorial
  // https://en.wikipedia.org/wiki/Document_type_definition
  /** Type: `SKIP` */
  DTD: [
    /^<!DOCTYPE\s\w+(\s\[[\s\S]*?\]|([\s\w]|("[^"]*")|('[^']*'))*)>/,
    Types.DTD,
  ],

  /** Type: `EXTERNAL_STYLE_SHEETS` */
  ExternalStyleSheets: [
    /^<\?xml\-stylesheet[\s\S]*?\?>/,
    Types.EXTERNAL_STYLE_SHEETS,
  ],

  //---//

  /** Type: `XML_DECL_START` - XML Declaration begin */
  XmlDeclStart: [/^<\?xml/, Types.XML_DECL_START],

  /** Type: `SPECIAL_CLOSE` - XML special close */
  SpecialClose: [/^\?>/, Types.SPECIAL_CLOSE],

  //---//

  /** Type: `NAME` */
  Name: [/^\w+:?[\w-]+/, Types.NAME],
  /** Type: `STRING` - "" or '' with its content */
  String: [/^("[^"]*")|('[^']*')/, Types.STRING],

  /** Type: `CDATA` - allows characters with markup */
  CData: [/^<!\[CDATA\[(?<raw>[\s\S]*)?\]\]\s?>/, Types.CDATA],
  /** Type: `TEXT` */
  Text: [/^[^<]+/, Types.TEXT],
  /** Type: `RAW_TEXT` */
  RawText: [/^(?<raw>[\s\S]+)<\//, Types.RAW_TEXT],

  /** Type: `<` */
  Open: [/^</, '<'],
  /** Type: `>` */
  Close: [/^>/, '>'],
  /** Type: `/` */
  Slash: [/^\//, '/'],
  /** Type: `=` */
  Equals: [/^=/, '='],
} as const;

export type TSpecKeys = keyof typeof Spec;
export type TSpec = (typeof Spec)[TSpecKeys];

//----------------------------------------------------------------------------//
// Set of Specs

/** To process the beginning of the file */
export const PrologSpecs: TSpec[] = [
  Spec.EndOfLine,
  Spec.EmptySpaces,

  Spec.Comment,

  Spec.DTD,
  Spec.ExternalStyleSheets,

  Spec.XmlDeclStart,
  Spec.SpecialClose,

  Spec.Name,

  Spec.Equals,

  Spec.String,

  Spec.Open,
];

/** To whenever it needs to read a content as a Raw Text */
export const SpecialTagSpecs: TSpec[] = [Spec.RawText, Spec.Open];

export const TagDeclSpecs: TSpec[] = [
  Spec.EndOfLine,
  Spec.EmptySpaces,

  Spec.Name,
  Spec.Equals,
  Spec.String,

  Spec.Slash,
  Spec.Close,
];

export const TagContentSpecs: TSpec[] = [
  Spec.EndOfLine,
  Spec.EmptySpaces,
  Spec.Comment,

  Spec.CData,
  Spec.Text,

  Spec.Open,
];

export const Specs = {
  Prolog: PrologSpecs,
  SpecialTag: SpecialTagSpecs,
  TagDecl: TagDeclSpecs,
  TagContent: TagContentSpecs,
};

//----------------------------------------------------------------------------//

export default Token;
