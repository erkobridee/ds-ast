import { isObject, isString, isNumber, isUndefined } from '~/utils/check';

export interface IToken {
  type: string;
  lexeme?: string;
}

//----------------------------------------------------------------------------//

export const tokenToString = (token: IToken): string => {
  const { type, lexeme } = token;

  return `Token( ${type}` + (lexeme ? `, ${lexeme}` : '') + ' )';
};

export class Token implements IToken {
  public type: string;
  public lexeme?: string;

  constructor(type: string, lexeme?: string) {
    this.type = type;
    this.lexeme = lexeme;
  }

  public toString(): string {
    return tokenToString(this);
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

  const [first, second] = args;

  if (isObject(first)) {
    const { type, lexeme } = first as IToken;
    return new Token(type, lexeme);
  }

  if (isString(first)) {
    if (isSecondInvalid(second)) {
      throw new BuildTokenError(
        'buildToken invalid second parameter [ accepts: string | number | undefined ]'
      );
    }

    return new Token(
      first as string,
      isString(second) ? (second as string) : undefined
    );
  }

  throw new BuildTokenError('buildToken has no valid argument');
};

//----------------------------------------------------------------------------//

export const Types = {
  SKIP: null,

  EOF: 'EOF',

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
export const buildEOFToken = () => new Token(Types.EOF);

export const isEOF = (token: IToken) => token.type === Types.EOF;

//----------------------------------------------------------------------------//
// Single Spec

export type TSpec = [RegExp, string | null];

//---//

/** Type: `ELEMENT` - any valid xml tag that could have attributes, content and it closes it at the end */
export const ElementSpec: TSpec = [
  /<(?<tag>[\w:]+)(?:(?<attributes>(\s(\w+)(?:=(?:"(.+)"|'(.+)'))?)+)|[\s\S]*?)>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
  Types.ELEMENT,
];

//---//

/** Type: `SKIP` */
export const EmptySpacesSpec: TSpec = [/^[\s\S]/, Types.SKIP];
/** Type: `SKIP` */
export const CommentSpec: TSpec = [/^<!--[\s\S]*?-->/, Types.SKIP];

/** Type: `NAME` */
export const NameSpec: TSpec = [/^\w+:[\w-]+/, Types.NAME];
/** Type: `STRING` - "" or '' with its content */
export const ValueSpec: TSpec = [/^("[^"]*")|('[^']*')/, Types.STRING];

/** Type: `CDATA` - allows characters with markup */
export const CDataSpec: TSpec = [
  /^<!\[CDATA\[(?<raw>[\s\S]*)?\]\]\s?>/,
  Types.CDATA,
];
/** Type: `TEXT` */
export const TextSpec: TSpec = [/^[^<&]+/, Types.TEXT];
/** Type: `RAW_TEXT` */
export const RawTextSpec: TSpec = [/^(?<raw>[\s\S]+)<\//, Types.RAW_TEXT];

/** Type: `<` */
export const OpenSpec: TSpec = [/^</, '<'];
/** Type: `>` */
export const CloseSpec: TSpec = [/^>/, '>'];
/** Type: `/` */
export const SlashSpec: TSpec = [/^\//, '/'];
/** Type: `=` */
export const EqualsSpec: TSpec = [/^=/, '='];

//----------------------------------------------------------------------------//
// Set of Specs

/** To process the beginning of the file */
export const PrologSpecs: TSpec[] = [
  EmptySpacesSpec,

  CommentSpec,

  // DTD
  // https://www.xmlfiles.com/dtd/
  // https://tutorialreference.com/xml/dtd/dtd-tutorial
  // https://en.wikipedia.org/wiki/Document_type_definition
  [/^<!DOCTYPE[\s\S]*?>/, Types.SKIP],

  // external style sheets
  // https://www.w3.org/Style/styling-XML.en.html
  [/^<\?xml\-stylesheet[\s\S]*?\?>/, Types.SKIP],

  // XML Declaration begin
  [/^<\?xml/, Types.XML_DECL_START],

  // XML special close
  [/^\?>/, Types.SPECIAL_CLOSE],

  NameSpec,

  EqualsSpec,

  ValueSpec,

  OpenSpec,
];

/** To whenever it needs to read a content as a Raw Text */
export const SpecialTagSpecs: TSpec[] = [RawTextSpec, OpenSpec];

export const TagSpecs: TSpec[] = [
  EmptySpacesSpec,
  CommentSpec,

  NameSpec,

  EqualsSpec,
  ValueSpec,

  SlashSpec,
  CloseSpec,

  CDataSpec,
  TextSpec,

  OpenSpec,
];

//----------------------------------------------------------------------------//

export default Token;
