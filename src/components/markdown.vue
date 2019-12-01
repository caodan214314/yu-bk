<template>
    <div>
        <mavon-editor v-model="content" :ishljs = "true" ref="md" @imgAdd="imgAdd" @imgDel="imgDel" @input="onChange"></mavon-editor>
    </div>
</template>
<script>

export default {
    name: 'markdown',
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
        async imgAdd(pos, $file) {
            const nowTime = new Date().getTime() / 1000
            const diffTime = nowTime - this.upload.params.expire
            if (!this.upload.url || diffTime >= -3) {
                const res = await this.getOSSToken()
                this.setOSStoken(res)
            }
            this.upload.params.name = $file.name
            // this.upload.params.key = this.upload.key + `/${this.keyBatch + new Date().getTime()}/${$file.name}`
            this.upload.params.key = this.upload.key + '/' + this.keyBatch + '/' + new Date().getTime() + '.' + $file.name.split('.')[1]

            let formdata = new FormData()
            Object.keys(this.upload.params).some(key => {
                formdata.append(key, this.upload.params[key])
            })
            formdata.append('file', $file)
            this.$ajax.post(this.upload.url, formdata, res => {
                if (res) {
                    /**
                     * 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
                     * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                     * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                     * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                     * $vm.$img2Url(pos, url)
                     */
                    this.$refs.md.$img2Url(pos, res.imgUrl)
                }
            }, { diy: true })
        },
        imgDel() {},
        onChange() {
            this.$emit('input', this.content)
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .v-note-panel {
    li, ol {
        list-style: decimal !important;
    }
    li, ul {
        list-style: inherit !important;
    }
}
</style>
