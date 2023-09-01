export function readFileData(blobUrl) {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then((blob) => blob.text())
    .catch((err) => null);
}

export function parseXML(str) {
  if (typeof str === 'string') {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }
  return str;
}
