class Introspection {
  _enums = null;

  constructor(data) {
    this._enums = data.__schema.types
      .filter(type => type.kind === 'ENUM')
      .reduce((obj, enumType) => {
        obj[enumType.name] = enumType.enumValues.map(value => value.name);
        return obj;
      }, {});
  }

  /**
   * isValidEnumValue returns true when given enum and value exists.
   * @param  {string}  name
   * @param  {string}  value
   * @return {boolean}
   */
  isValidEnumValue(name, value) {
    return this._enums[name] && this._enums[name].indexOf(value) >= 0;
  }
}

/**
 * createIntrospection returns a introspection service
 * @param  {Object}  data   introspection query data
 * @return {Object}         introspection service
 */
export function createIntrospection(data) {
  return new Introspection(data);
}
