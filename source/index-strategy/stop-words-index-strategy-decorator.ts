/**
 * Stop words are very common (e.g. "a", "and", "the") and are often not semantically meaningful in the context of a
 * search. This class removes stop words from an index before passing the remaining words along to the decorated index
 * strategy for processing.
 */
class StopWordsIndexStrategyDecorator implements IIndexStrategy {

  private decoratedIndexStrategy_:IIndexStrategy;
  private stopWordsMap_:Object;

  /**
   * Constructor.
   *
   * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
   */
  constructor(decoratedIndexStrategy:IIndexStrategy) {
    this.decoratedIndexStrategy_ = decoratedIndexStrategy;

    // Stop words adapted from www.ranks.nl/stopwords
    this.stopWordsMap_ = {};
    this.stopWordsMap_['a'] = true;
    this.stopWordsMap_['about'] = true;
    this.stopWordsMap_['an'] = true;
    this.stopWordsMap_['are'] = true;
    this.stopWordsMap_['as'] = true;
    this.stopWordsMap_['at'] = true;
    this.stopWordsMap_['be'] = true;
    this.stopWordsMap_['by '] = true;
    this.stopWordsMap_['for'] = true;
    this.stopWordsMap_['from'] = true;
    this.stopWordsMap_['how'] = true;
    this.stopWordsMap_['i'] = true;
    this.stopWordsMap_['in'] = true;
    this.stopWordsMap_['is'] = true;
    this.stopWordsMap_['it'] = true;
    this.stopWordsMap_['of'] = true;
    this.stopWordsMap_['on'] = true;
    this.stopWordsMap_['or'] = true;
    this.stopWordsMap_['that'] = true;
    this.stopWordsMap_['the'] = true;
    this.stopWordsMap_['this'] = true;
    this.stopWordsMap_['to'] = true;
    this.stopWordsMap_['was'] = true;
    this.stopWordsMap_['what'] = true;
    this.stopWordsMap_['when'] = true;
    this.stopWordsMap_['where'] = true;
    this.stopWordsMap_['who'] = true;
    this.stopWordsMap_['will'] = true;
    this.stopWordsMap_['with'] = true;
  }

  /**
   * @inheritDocs
   */
  public expandToken(token:string):Array<string> {
    if (this.stopWordsMap_[token]) {
      return [];
    } else {
      return this.decoratedIndexStrategy_.expandToken(token);
    }
  }
};