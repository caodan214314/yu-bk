import mUpload from './m-upload'
import mExcel from './m-excel'
import mUploadMilt from './m-upload-milt'
import mEditor from './m-editor'
import markdown from './markdown'
const components = [mUpload, mUploadMilt, mEditor, markdown, mExcel]

const install = function(Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}
export default Object.assign({ ...components }, { install })
