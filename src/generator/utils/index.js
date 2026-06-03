function stringifyAttrs(attrs) {
  const result = [];

  for (const key in attrs) {
    const value = attrs[key];

    if (value === true) {
      result.push(key);
    } else if (value) {
      result.push(`${key}="${value}"`);
    }
  }

  return result.length ? result.join(" ") : "";
}

module.exports = {
  stringifyAttrs,
};
