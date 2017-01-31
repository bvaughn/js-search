// @flow

import type { IIndexStrategy } from './IndexStrategy';

/**
 * Indexes for exact word matches.
 */
export class ExactWordIndexStrategy implements IIndexStrategy {

  /**
   * @inheritDocs
   */
  expandToken(token : string) : Array<string> {
    return token ? [token] : [];
  }
};
