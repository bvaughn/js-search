/**
 * Indexes for exact word matches.
 */
class ExactWordIndexStrategy implements IIndexStrategy {

  /**
   * @inheritDocs
   */
  public expandToken(token:string):Array<string> {
    return token ? [token] : [];
  }
};