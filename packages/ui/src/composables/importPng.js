export const importPng = name => {
  return new URL(`/src/assets/${name}.png`, import.meta.url).href
}
