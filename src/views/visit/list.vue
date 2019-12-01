<template>
    <div class="page">
        <div class="search mb30">
            <el-card class="box-card">
                <el-form :inline="true" :model="searchForm">
                    <el-form-item label="到访日期">
                        <el-date-picker size="mini" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.createTime" type="datetimerange" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="门店">
                        <el-select v-model="searchForm.orgId" placeholder="请选择门店" clearable size="mini">
                            <el-option v-for="(item, i) in orgList" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户来源">
                        <el-select v-model="searchForm.orgId" placeholder="请选择" clearable size="mini">
                            <el-option v-for="(item, i) in orgList" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="咨询项目">
                        <el-select v-model="searchForm.orgId" placeholder="请选择" clearable size="mini">
                            <el-option v-for="(item, i) in orgList" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否有效">
                        <el-select v-model="searchForm.orgId" placeholder="选择是否有效到访" clearable size="mini">
                            <el-option v-for="(item, i) in orgList" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="面咨老师">
                        <el-select v-model="searchForm.orgId" placeholder="请选择" clearable size="mini">
                            <el-option v-for="(item, i) in orgList" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input placeholder="审批人" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="客户姓名">
                        <el-input placeholder="审批人" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="呼叫老师">
                        <el-input placeholder="审批人" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml30" type="primary" @click="onSubmit" size="mini">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="row toolbar">
            <el-button type="primary" @click="onAdd()">新建</el-button>
        </div>
        <el-table :data="gridData" :fit="true" stripe>
            <el-table-column prop="vistTime" label="到访日期" width="100"></el-table-column>
            <el-table-column prop="realname" label="客户姓名"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="telephone" label="手机号1" width="110"></el-table-column>
            <el-table-column prop="telephone_bak" label="手机号2" width="110"></el-table-column>
            <el-table-column prop="comeFrom" label="来源"></el-table-column>
            <el-table-column prop="callTeacher" label="呼叫老师"></el-table-column>
            <el-table-column prop="faceTeacher" label="面咨老师"></el-table-column>
            <el-table-column prop="shopName" label="门店" width="120" ></el-table-column>
            <el-table-column prop="subjectName" label="咨询项目"></el-table-column>
            <el-table-column prop="vistStatus" label="是否有效到访" width="110"></el-table-column>
            <el-table-column prop="vistDesc" label="备注" :show-overflow-tooltip="true"  width="150"></el-table-column>
            <el-table-column label="操作" fixed="right" width="120" align="left">
                <template slot-scope="{  }">
                    <el-button type="text" class="ml10 mb5" size="small">查看</el-button>
                    <el-button class="mb5" type="text" size="small">编辑</el-button>
                    <el-button class="mb5" type="text" size="small">删除</el-button>
                    <el-button class="mb5" type="text" size="small">有效判定</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagerout" v-if="searchForm.total">
            <el-pagination small layout="total, prev, pager, next, jumper" :current-page="searchForm.start / searchForm.size + 1" :page-size="searchForm.size" :total="searchForm.total" @current-change="onPageChange"></el-pagination>
        </div>
        <!-- add/edit dialog -->
    </div>
</template>
<script>
import { DIC } from '../dic.js'
export default {
    name: 'visitList',
    data() {
        return {
            searchForm: {

                total: 0,
                start: 0,
                size: 20
            },
            url: {
                list: '/vist/list',
                add: '/course/add',
                detail: '/course/detail',
                update: '/course/update',
                isOff: '/course/isoff',
                province: '/province/list',
                citys: '/city/list',
                categoryList: '/dict/cat/selectAll'
            },
            gridData: []
        }
    },
    mounted() {
        this.renderGrid()
    },
    methods: {
        onSearch() {
            this.searchForm.start = 0
            this.renderGrid()
        },
        renderGrid() {
            const params = this.$util.batchTrim(this.searchForm, true)
            this.$ajax.post(this.url.list, params, res => {
                console.log(res)
                this.gridData = res.list || []
                this.searchForm.total = ~~res.total
            })
        },
        onPageChange(curPage) {
            this.searchForm.start = (curPage - 1) * this.searchForm.size
            this.onSearch()
        }
    }
}

</script>
<style lang="scss">
.box-card {
    /deep/ .el-form .el-form-item .el-form-item__label {
        min-width: 80px;
    }
    /deep/ .el-form .el-form-item {
        margin-bottom: 5px;
    }
    /deep/ .el-form .el-input {
        width: 155px !important;
    }
    /deep/ .el-card__body {
        padding:20px 10px;
    }
    /deep/ .el-button+.el-button {
        margin-left: 10px !important;
    }
}

// .page {
//     padding: 20px;
// }

// .el-form-item__label deep {
//     width: 100px !important;
// }

// .widthSet {
//     width: 60% !important;
// }

// .el-date-editor--datetimerange.el-input__inner {
//     width: 230px;
// }

// .edit_container {
//     width: 80%;
// }

// .seltSet {
//     width: 100% !important;
// }

// .seltSet2 {
//     width: 50% !important;
//     margin-left: 2%;
//     vertical-align: top;
// }

// .item {
//     width: 135px;
//     text-align: right;
//     padding-right: 10px;
//     display: inline-block;
// }

// em {
//     color: #ff0000;
//     display: inline-block;
//     padding-right: 5px;
//     font-style: normal;
// }

// .el-row {
//     margin-bottom: 20px;
// }

// .imgSty {
//     width: 148px;
//     height: 148px;
//     border: 1px solid #eee;
//     display: inline-block;
//     margin-right: 10px;
// }

// .witSet {
//     width: 60% !important;
// }

// .selt100 {
//     width: 30% !important;
// }

// label {
//     min-width: auto !important;
// }

// .el-cascader {
//     width: 60%;

//     .el-input {
//         width: 100% !important;
//     }
// }
// .wid100{
//     width: 100px;
//     display: inline-block;
// }

</style>
