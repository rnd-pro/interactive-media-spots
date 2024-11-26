/**
 * 
 * @param {String[]} variants 
 * @param {*} element 
 */
export function getVariantFit(variants, element) {
  let numberVars = variants.filter((vnt) => {
    return !Number.isNaN(parseFloat(vnt));
  }).map((v) => {
    return parseFloat(v);
  }).sort((a, b) => {
    return b - a;
  });
  /** @type {DOMRect} */
  let rect = element.getBoundingClientRect();
  let variantFit = numberVars.pop();
  while (numberVars.length && (variantFit < rect.width)) {
    variantFit = numberVars.pop();
  }
  return variantFit;
}