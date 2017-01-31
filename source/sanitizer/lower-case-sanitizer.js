// @flow

import type { ISanitizer } from './sanitizer';

/**
 * Sanitizes text by converting to a locale-friendly lower-case version and triming leading and trailing whitespace.
 */
export class LowerCaseSanitizer implements ISanitizer {

  /**
   * @inheritDocs
   */
  sanitize(text : string) : string {
    return text ? text.toLocaleLowerCase().trim() : '';
  }
};
