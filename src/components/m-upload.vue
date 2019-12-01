<template>
    <el-upload class="avatar-uploader" accept="image/gif,image/jpeg,image/jpg,image/bmp,image/png" :action="upload.url" :data="upload.params" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <i v-if="imageUrl" class="el-icon-error uploader-clearImg" @click.stop="handleRemove"></i>
    </el-upload>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'm-upload',
    props: {
        value: {
            default: ''
        },
        bizType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            imageUrl: '',
            upload: {
                url: '',
                params: {},
                key: ''
            },
            keyBatch: ''
        }
    },
    created() {
        this.imageUrl = this.value
        this.init()
    },
    // computed: {
    //     ref() {
    //         return this.prop + this.refName
    //     }
    // },
    watch: {
        value(n) {
            this.imageUrl = n
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
        handleAvatarSuccess(res, file) {
            if (res.status === 'OK') {
                this.imageUrl = res.imgUrl
                this.$emit('input', res.imgUrl)
                // this.$refs[this.ref].clearValidate()
            }
        },
        handleRemove() {
            this.imageUrl = ''
            this.$emit('input', '')
        },
        async beforeAvatarUpload(file) {
            const nowTime = new Date().getTime() / 1000
            const diffTime = nowTime - this.upload.params.expire
            if (!this.upload.url || diffTime >= -3) {
                const res = await this.getOSSToken()
                this.setOSStoken(res)
            }
            this.upload.params.name = file.name
            this.upload.params.key = this.upload.key + '/' + this.keyBatch + '/' + new Date().getTime() + '.' + file.name.split('.')[1]
        }
    }
}
</script>

<style>
.avatar-uploader {
    position: relative;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: #f3f4f5;
}
.avatar-uploader .el-upload:hover {
    border-color: #ffffff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #dcdfe6;
    width: 120px;
    height: 76px;
    line-height: 76px;
    text-align: center;
}
.avatar {
    width: 120px;
    height: 76px;
    display: block;
    border-radius: 4px;
    overflow: hidden;
}
.uploader-clearImg {
    border-radius: 8px;
    background: #fff;
    display: block;
    cursor: pointer;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    position: absolute;
    right: -6px;
    top: -6px;
    z-index: 999;
}
</style>
