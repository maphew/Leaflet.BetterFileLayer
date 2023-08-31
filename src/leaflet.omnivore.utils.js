export function addData(l, d) {
  if ('setGeoJSON' in l) {
    l.setGeoJSON(d);
  } else if ('addData' in l) {
    l.addData(d);
  }
}

export function parseXML(str) {
  if (typeof str === 'string') {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }
  return str;
}
