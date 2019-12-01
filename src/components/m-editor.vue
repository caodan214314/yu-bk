<template>
    <div>
        <quilleditor v-model="content" ref="myTextEditor" :options="editorOption" @change="onChange">
            <div :id="toolName" slot="toolbar">
                <select class="ql-size">
                    <option value="small"></option>
                    <!-- Note a missing, thus falsy value, is used to reset to default -->
                    <option selected></option>
                    <option value="large"></option>
                    <option value="huge"></option>
                </select>
                <!-- Add subscript and superscript buttons -->
                <span class="ql-formats"><button class="ql-script" value="sub"></button></span>
                <span class="ql-formats"><button class="ql-script" value="super"></button></span>
                <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                <span class="ql-formats"><button type="button" class="ql-header" value="1" title="标题1"></button></span>
                <span class="ql-formats"><button type="button" class="ql-header" value="2" title="标题2"></button></span>
                <span class="ql-formats" title="字体颜色"><select class="ql-color">
                    <option selected="selected"></option>
                    <option value="#e60000"></option>
                    <option value="#ff9900"></option>
                    <option value="#ffff00"></option>
                    <option value="#008a00"></option>
                    <option value="#0066cc"></option>
                    <option value="#9933ff"></option>
                    <option value="#ffffff"></option>
                    <option value="#facccc"></option>
                    <option value="#ffebcc"></option>
                    <option value="#ffffcc"></option>
                    <option value="#cce8cc"></option>
                    <option value="#cce0f5"></option>
                    <option value="#ebd6ff"></option>
                    <option value="#bbbbbb"></option>
                    <option value="#f06666"></option>
                    <option value="#ffc266"></option>
                    <option value="#ffff66"></option>
                    <option value="#66b966"></option>
                    <option value="#66a3e0"></option>
                    <option value="#c285ff"></option>
                    <option value="#888888"></option>
                    <option value="#a10000"></option>
                    <option value="#b26b00"></option>
                    <option value="#b2b200"></option>
                    <option value="#006100"></option>
                    <option value="#0047b2"></option>
                    <option value="#6b24b2"></option>
                    <option value="#444444"></option>
                    <option value="#5c0000"></option>
                    <option value="#663d00"></option>
                    <option value="#666600"></option>
                    <option value="#003700"></option>
                    <option value="#002966"></option>
                    <option value="#3d1466"></option>
                  </select></span>
                    <span class="ql-formats" title="背景色"> <select class="ql-background">
                        <option value="#000000"></option>
                        <option value="#e60000"></option>
                        <option value="#ff9900"></option>
                        <option value="#ffff00"></option>
                        <option value="#008a00"></option>
                        <option value="#0066cc"></option>
                        <option value="#9933ff"></option>
                        <option selected="selected"></option>
                        <option value="#facccc"></option>
                        <option value="#ffebcc"></option>
                        <option value="#ffffcc"></option>
                        <option value="#cce8cc"></option>
                        <option value="#cce0f5"></option>
                        <option value="#ebd6ff"></option>
                        <option value="#bbbbbb"></option>
                        <option value="#f06666"></option>
                        <option value="#ffc266"></option>
                        <option value="#ffff66"></option>
                        <option value="#66b966"></option>
                        <option value="#66a3e0"></option>
                        <option value="#c285ff"></option>
                        <option value="#888888"></option>
                        <option value="#a10000"></option>
                        <option value="#b26b00"></option>
                        <option value="#b2b200"></option>
                        <option value="#006100"></option>
                        <option value="#0047b2"></option>
                        <option value="#6b24b2"></option>
                        <option value="#444444"></option>
                        <option value="#5c0000"></option>
                        <option value="#663d00"></option>
                        <option value="#666600"></option>
                        <option value="#003700"></option>
                        <option value="#002966"></option>
                        <option value="#3d1466"></option>
                    </select>
                </span>
                <span class="ql-formats"><button type="button" class="ql-underline" title="下划线"></button></span>
                <span class="ql-formats" title="对齐">
                    <select class="ql-align">
                        <option selected="selected"></option>
                        <option value="center"></option>
                        <option value="right"></option>
                        <option value="justify"></option>
                    </select>
                </span>
                <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                <span class="ql-formats"><button type="button" class="ql-link"></button></span>
                <span class="ql-formats">
                    <button type="button" @click="imgClick" style="outline:none">
                        <svg viewBox="0 0 18 18">
                            <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                            <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                            <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
                        </svg>
                    </button>
                </span>
                <span class="ql-formats"><button type="button" class="ql-video"></button></span>
            </div>
        </quilleditor>
    </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
    name: 'm-editor',
    props: {
        value: {
            type: String
        },
        maxUploadSize: {
            type: Number,
            default: 1024 * 1024 * 500
        },
        bizType: {
            type: String,
            required: true
        },
        toolName: {
            type: String,
            default: 'toolbar'
        }
    },
    data() {
        return {
            content: '',
            editorOption: {
                modules: {
                    toolbar: `#${this.toolName}`
                }
            },
            upload: {
                url: '',
                params: {},
                key: ''
            },
            keyBatch: ''
        }
    },
    created() {
        this.getOSSToken()
    },
    methods: {
        getOSSToken() {
            return this.$store.dispatch('GetOssToken', this.bizType)
        },
        setOSStoken(res) {
            const token = res.result || res
            this.upload.url = token.host
            this.upload.key = token.dir.replace(/^\//, '')
            this.upload.params = {
                key: token.dir,
                OSSAccessKeyId: token.accessId,
                signature: token.signature,
                policy: token.policy,
                expire: token.expire,
                callback: token.callback,
                success_action_status: 200,
                'x:device': 'PC',
                'x:bizId': token.bizId,
                'x:bizType': token.bizType,
                'x:keybatch': token.keyBatch
            }
            this.keyBatch = token.keyBatch
        },
        onChange() {
            this.$emit('input', this.content)
        },
        /* 选择上传图片切换 */
        async onFileChange(e) {
            let fileInput = e.target
            if (fileInput.files.length === 0) {
                return
            }
            const nowTime = new Date().getTime() / 1000
            const diffTime = nowTime - this.upload.params.expire
            if (!this.upload.url || diffTime >= -3) {
                const res = await this.getOSSToken()
                this.setOSStoken(res)
            }
            this.upload.params.name = fileInput.files[0].name
            // this.upload.params.key = this.upload.key + `/${this.keyBatch + new Date().getTime()}/${fileInput.files[0].name}`
            this.upload.params.key = this.upload.key + '/' + this.keyBatch + '/' + new Date().getTime() + '.' + fileInput.files[0].name.split('.')[1]

            this.editor.focus()
            let data = new FormData()
            Object.keys(this.upload.params).some(key => {
                data.append(key, this.upload.params[key])
            })
            data.append('file', fileInput.files[0])
            this.$ajax.post(this.upload.url, data, res => {
                if (res) {
                    this.editor.insertEmbed(this.editor.getSelection().index, 'image', res.imgUrl)
                }
            }, { diy: true })
        },
        /* 点击上传图片按钮 */
        imgClick() {
            /* 内存创建input file */
            let input = document.createElement('input')
            input.type = 'file'
            input.name = this.fileName
            input.accept = 'image/jpeg,image/png,image/jpg,image/gif'
            input.onchange = this.onFileChange
            input.click()
        }
    },
    computed: {
        editor() {
            return this.$refs.myTextEditor.quill
        }
    },
    components: {
        'quilleditor': quillEditor
    },
    mounted() {
        this.content = this.value
    },
    watch: {
        'value'(newVal, oldVal) {
            if (this.editor) {
                if (newVal !== this.content) {
                    this.content = newVal
                }
            }
        }
    }
}

</script>
