export const importSvg = name => {
  return new URL(`/src/assets/${name}.svg`, import.meta.url).href
}
