import { ref } from 'vue'

export function useFileUploader() {
  const myFile = ref(null)
  const fileInfo = ref('')

  function onFileSelected() {
    const file = myFile.value.files[0]
    if (!file) {
      console.error('invalid format')
    } else {
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onerror = e => console.error(e)
      reader.onload = e => (fileInfo.value = JSON.parse(e.target.result))
    }
  }

  function triggerSelectFile() {
    myFile.value.click()
  }

  return {
    onFileSelected,
    triggerSelectFile,
    myFile,
    fileInfo,
  }
}
