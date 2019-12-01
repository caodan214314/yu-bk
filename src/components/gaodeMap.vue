<template>
<div>
    <div class="amap-page-container">
        <el-amap vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo" :events="events">
            <el-amap-marker v-for="(marker, i) in markers" :position="marker" :key="i"></el-amap-marker>
        </el-amap>
        <el-amap-search-box class="search-box mb10" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
    </div>
    <div class="action clear">
            <div class="toolbar fl">
                position: [{{ lng }}, {{ lat }}] address: {{ address }}
            </div>
            <div class="btnbox fr">
                <el-button class="fr" size="mini" type="primary" @click="onSave">确 定</el-button>
            </div>
    </div>
</div>
</template>
<script>
import VueAMap from 'vue-amap'
VueAMap.initAMapApiLoader({
    key: 'c84e8986c7e9b7081ca34b71023d4e6c',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Geocoder', 'AMap.AMapManager', 'AMap.Marker'],
    v: '1.4.4'
})
export default {
    data() {
        let self = this
        return {
            searchOption: {
                city: '杭州',
                citylimit: true
            },
            markers: [],
            zoom: 12,
            center: [120.15, 30.28],
            mapCenter: [120.15, 30.28],
            address: '',
            events: {
                click(e) {
                    let { lng, lat } = e.lnglat
                    self.lng = lng
                    self.lat = lat
                    // 这里通过高德 SDK 完成
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: 'all'
                    })
                    geocoder.getAddress([lng, lat], function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                self.address = result.regeocode.formattedAddress
                                self.$nextTick()
                                self.removeMarker()
                                self.markers.push([lng, lat])
                            }
                        }
                    })
                }
            },
            lng: 0,
            lat: 0
        }
    },
    methods: {
        onSave() {
            let data = {
                lng: this.lng,
                lat: this.lat,
                address: this.address,
                choose: true
            }
            this.$emit('getChildData', data)
        },
        addMarker() {
            let lng = 121.5 + Math.round(Math.random() * 1000) / 10000
            let lat = 31.197646 + Math.round(Math.random() * 500) / 10000
            this.markers.push([lng, lat])
        },
        onSearchResult(pois) {
            this.removeMarker()
            let latSum = 0
            let lngSum = 0
            if (pois.length > 0) {
                pois.forEach(poi => {
                    let { lng, lat } = poi
                    lngSum += lng
                    latSum += lat
                    this.markers.push([poi.lng, poi.lat])
                })
                let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                }
                this.center = [center.lng, center.lat]
                this.mapCenter = [center.lng, center.lat]

                this.changeLocation([pois[0].lng, pois[0].lat])
            }
        },
        /*
            @ function : 根据输入的地址获取经纬度 进行地图的联动显示
            @ param : data 选择的地址  深圳市宝安区
        */
        changeLocation(data) {
            [this.lng, this.lat] = data
            var self = this
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all'
            })
            geocoder.getAddress(data, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {
                        self.address = result.regeocode.formattedAddress
                        self.$nextTick()
                    }
                }
            })
        },
        removeMarker() {
            if (!this.markers.length) return
            this.markers = []
        }
    }
}
</script>
<style>
.action{
    padding: 10px 0px;
}
    .toolbar {
        width: 80%;
    }
    .el-vue-search-box-container{
        top: -390px;
    }
    .amap-page-container {
      width:100%;
      height:400px;
    }
</style>
