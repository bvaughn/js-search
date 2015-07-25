/**
 * Simple tokenizer that splits strings on whitespace characters and returns an array of all non-empty substrings.
 */
class WhitespaceTokenizer implements ITokenizer {

  /**
   * @inheritDocs
   */
  public tokenize(text:string):Array<string> {
    return text.split(/\s+/)
      .filter(function(text:string):boolean {
        return !!text; // Filter empty tokens
      });
  }
};