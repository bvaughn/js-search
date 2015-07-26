class TokenHighlighter {

  private indexStrategy_:IIndexStrategy;
  private sanitizer_:ISanitizer
  private wrapperTagName_:string;

  constructor(opt_indexStrategy:IIndexStrategy, opt_sanitizer:ISanitizer, opt_wrapperTagName:string) {
    this.indexStrategy_ = opt_indexStrategy || new PrefixIndexStrategy();
    this.sanitizer_ = opt_sanitizer || new LowerCaseSanitizer();
    this.wrapperTagName_ = opt_wrapperTagName || 'mark';
  }

  /**
   * Highlights token occurrences within a string by wrapping them with a DOM element.
   *
   * @param text e.g. "john wayne"
   * @param tokens e.g. ["wa"]
   * @returns {string} e.g. "john <mark>wa</mark>yne"
   */
  public highlight(text:string, tokens:Array<string>) {
    var tagsLength:number = this.wrapText_('').length;

    var tokenDictionary = {};

    // Create a token map for easier lookup below.
    for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
      var token:string = this.sanitizer_.sanitize(tokens[i]);
      var expandedTokens:Array<string> = this.indexStrategy_.expandToken(token);

      for (var j = 0, numExpandedTokens = expandedTokens.length; j < numExpandedTokens; j++) {
        var expandedToken:string = expandedTokens[j];

        if (!tokenDictionary[expandedToken]) {
          tokenDictionary[expandedToken] = [token];
        } else {
          tokenDictionary[expandedToken].push(token);
        }
      }
    }

    // Track actualCurrentWord and sanitizedCurrentWord separately in case we encounter nested tags.
    var actualCurrentWord:string = '';
    var sanitizedCurrentWord:string = '';
    var currentWordStartIndex:number = 0;

    // Note this assumes either prefix or full word matching.
    for (var i = 0, textLength = text.length; i < textLength; i++) {
      var character:string = text.charAt(i);

      if (character === ' ') {
        actualCurrentWord = '';
        sanitizedCurrentWord = '';
        currentWordStartIndex = i + 1;
      } else {
        actualCurrentWord += character;
        sanitizedCurrentWord += this.sanitizer_.sanitize(character);
      }

      if (tokenDictionary[sanitizedCurrentWord] &&
          tokenDictionary[sanitizedCurrentWord].indexOf(sanitizedCurrentWord) >= 0) {

        actualCurrentWord = this.wrapText_(actualCurrentWord);
        text = text.substring(0, currentWordStartIndex) + actualCurrentWord + text.substring(i + 1);

        i += tagsLength;
        textLength += tagsLength;
      }
    }

    return text;
  }

  private wrapText_(text:string) {
    return `<${this.wrapperTagName_}>${text}</${this.wrapperTagName_}>`;
  }
}