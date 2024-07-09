export function getDataAttributes(element) {
    if (!(element instanceof HTMLElement)) {
        throw new Error("Provided element is not a valid HTMLElement.");
    }

    let attributes = element.attributes;
    let dataAttributesObject = {};
    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].name.startsWith('data-')) {
            let key = attributes[i].name.slice(5); // Remove 'data-' prefix
            dataAttributesObject[key] = attributes[i].value;
        }
    }
  
    return dataAttributesObject;
  }