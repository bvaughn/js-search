// @flow

import type { ISanitizer } from './sanitizer';

/**
 * Enforces case-sensitive text matches.
 */
export class CaseSensitiveSanitizer implements ISanitizer {

  /**
   * @inheritDocs
   */
  sanitize(text : string) : string {
    return text ? text.trim() : '';
  }
};
