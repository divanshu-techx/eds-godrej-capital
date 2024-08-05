export function getDataAttributes(element) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Provided element is not a valid HTMLElement.');
  }
  const attributes = element.attributes;
  const dataAttributesObject = {};
  for (let i = 0; i < attributes.length; i += 1) {
    if (attributes[i].name.startsWith('data-')) {
      const key = attributes[i].name.slice(5); // Remove 'data-' prefix
      dataAttributesObject[key] = attributes[i].value;
    }
  }
  return dataAttributesObject;
}
