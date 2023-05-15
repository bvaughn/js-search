/**
 * Find and return nested object values.
 *
 * @param object to crawl
 * @param path Property path
 * @returns {any}
 */
export default function getNestedFieldValues(object : Object, path : Array<string>) {
  path = path || [];
  object = object || {};

  var values = [];
  var value = object;
  // walk down the property path
  for (var i = 0; i < path.length; i++) {
    if (path[i] == "[]") {
      for (var j=0; j < value.length; j++) {
        values = values.concat(getNestedFieldValues(value[j], path.slice(i + 1, path.length)));
      }
      return values;
    } else {
      value = value[path[i]];
      if (value == null || value == undefined) {
        return [];
      }
    }
  }

  return [value];
}
