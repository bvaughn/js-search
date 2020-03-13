// @flow

/**
 * Find and return a nested object value.
 *
 * @param object to crawl
 * @param path Property path
 * @returns {any}
 */
export default function getNestedFieldValue(object : Object, path : Array<string>): any {
  path = path || [];
  object = object || {};

  var value = object;

  // walk down the property path
  for (var i = 0; i < path.length; i++) {
    value = value[path[i]];

    if (value == null) {
      return null;
    }
  }

  return value;
}
