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

//----------------------------------------------------------------------------//

export const Types = {
  EOF: 'EOF',

  SKIP: null,

  XML_DECL_START: 'XML_DECL_START',
  SPECIAL_CLOSE: 'SPECIAL_CLOSE',

  STRING: 'STRING',
  NAME: 'NAME',
  Text: 'TEXT',
} as const;

// EOF - End of File
export const buildEOFToken = () => new Token(Types.EOF);

//----------------------------------------------------------------------------//

export const Specs = [
  //----------------------------------------------------------------------------
  // Ignore

  // Empty Spaces
  [/^[\s\S]/, Types.SKIP],

  // multi line comment
  [/^<!--[\s\S]*?-->/, Types.SKIP],

  // CDATA - allows characters with markup
  [/^<!\[CDATA\[([\s\S]*)?\]\]\s?>/, Types.SKIP],

  // DTD
  // https://www.xmlfiles.com/dtd/
  // https://tutorialreference.com/xml/dtd/dtd-tutorial
  // https://en.wikipedia.org/wiki/Document_type_definition
  [/^<!DOCTYPE[\s\S]*?>/, Types.SKIP],

  // external style sheets
  // https://www.w3.org/Style/styling-XML.en.html
  [/^<\?xml\-stylesheet[\s\S]*?\?>/, Types.SKIP],

  //----------------------------------------------------------------------------
  // xml named tokens

  // XML Declaration begin
  [/^<\?xml/, Types.XML_DECL_START],

  // XML special close
  [/^\?>/, Types.SPECIAL_CLOSE],

  // Strings
  // "" or ''
  [/^("[^"]*")|('[^']*')/, Types.STRING],

  // Name
  [/^^\w+:[\w-]+/, Types.NAME],

  // Text
  [/^[^<&]+/, Types.Text],

  /*
    TODO: check how to handle, script, and the style tags
   */

  //----------------------------------------------------------------------------
  // Symbols, delimiters
  //
  // since them are single characters, we can use their definition directly

  [/^</, '<'],
  [/^>/, '>'],
  [/^\//, '/'],
  [/^=/, '='],
] as const;

//----------------------------------------------------------------------------//

export default Token;
