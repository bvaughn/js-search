class LowerCaseSanitizer implements ISanitizer {

  public sanitize(text:string):string {
    return text ? text.toLocaleLowerCase().trim() : '';
  }
};