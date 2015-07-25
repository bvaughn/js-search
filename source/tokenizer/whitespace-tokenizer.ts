class WhitespaceTokenizer implements ITokenizer {

  public tokenize(text:string):Array<string> {
    return text.split(/\s+/)
      .filter(function(text:string):boolean {
        return !!text; // Filter empty tokens
      });
  }
};