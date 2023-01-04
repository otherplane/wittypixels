export function copyTextToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        function () {
          console.log('Async: Copying to clipboard was successful!')
          resolve('')
        },
        function (err) {
          reject(err)
          console.error('Async: Could not copy text: ', err)
        }
      )
    }
  })
}
