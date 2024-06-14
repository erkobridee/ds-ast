/**
 * Recursive descent parser implementation.
 */
export class Parser {
  private source = '';

  /**
   * Parses the source code and returns the abstract syntax tree
   *
   * @param {string} source - the source code
   * @returns {ASTNode} - the abstract syntax tree
   */
  public parse(source = '') {
    this.source = source;

    /*
      Parse recursively, starting from the main entry point
      the Program
    */
    return this.Program();
  }

  //--------------------------------------------------------------------------//

  /**
   * Main entry point
   *
   * Program
   *   : NumericLiteral
   *   ;
   */
  private Program() {
    return this.NumericLiteral();
  }

  /**
   * NumericLiteral
   *   : NUMBER
   *   ;
   */
  private NumericLiteral() {
    return {
      type: 'NumericLiteral',
      value: Number(this.source),
    };
  }

  //--------------------------------------------------------------------------//
}

export default Parser;
