<template>
    <el-upload class="avatar-uploader" accept="image/gif,image/jpeg,image/jpg,image/bmp,image/png" list-type="picture-card" name="file" :action="upload.url" :data="upload.params" :file-list="fileList" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
    </el-upload>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'm-upload-milt',
    props: {
        value: {
            default: () => {
                return []
            }
        },
        bizType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            fileList: [],
            upload: {
                url: '',
                params: {},
                key: ''
            },
            keyBatch: ''
        }
    },
    created() {
        this.fileList = JSON.parse(JSON.stringify(this.value))
        this.init()
    },
    watch: {
        value(n) {
            this.fileList = n || []
        }
    },
    methods: {
        ...mapActions([
            'GetOssToken'
        ]),
        init() {
            if (this.$store.state.ossToken.code === '200') {
                return
            }
            this.getOSSToken().then((res) => {
                this.setOSStoken(res)
            })
        },
        getOSSToken() {
            return this.$store.dispatch('GetOssToken', this.bizType)
        },
        setOSStoken(res) {
            const token = res.result || res
            this.upload.url = token.host
            this.upload.key = token.dir.replace(/^\//, '')
            this.upload.params = {
                key: token.dir.replace(/^\//, ''), // course
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
        handleAvatarSuccess(res, file) {
            if (res.status === 'OK') {
                this.fileList.push({ url: res.imgUrl, uid: file.uid })
            } else {
                this.$message.error('图片带有特殊字符或名字过长 上传失败！！！')
            }
            this.emitInput()
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
            this.emitInput()
        },
        async beforeAvatarUpload(file) {
            const nowTime = new Date().getTime() / 1000
            const diffTime = nowTime - this.upload.params.expire
            if (!this.upload.url || diffTime >= -3) {
                const res = await this.getOSSToken()
                this.setOSStoken(res)
            }
            this.upload.params.name = file.name
            this.upload.params.key = this.upload.key + `/${this.keyBatch + new Date().getTime()}/${file.name}`
        },
        emitInput() {
            this.$emit('input', JSON.parse(JSON.stringify(this.fileList)))
        }
    }
}

</script>
<style lang="scss" scoped>
/deep/ .el-upload-list--picture-card .el-upload-list__item-status-label {
    position: absolute;
    right: -15px;
    top: -11px;
    width: 30px;
    height: 24px;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 76px;
}

/deep/ .el-upload--picture-card {
    font-size: 28px;
    width: 120px;
    height: 76px;
    line-height: 76px;
    text-align: center;

    i {
        color: #DCDFE6 !important;
    }
}

/deep/ .el-upload-list--picture-card .el-progress {
    width: 60px !important;
}

/deep/ .el-progress__text {
    font-size: 12px !important;
}

/deep/ .el-progress-circle {
    width: 60px !important;
    height: 60px !important;
}

</style>
