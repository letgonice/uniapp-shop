<template>
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000" :circular="true">
			<swiper-item v-for="(item ,i) in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url=" '/subpackage/goods_detail/goods_detail?goods_id='+item.goods_id ">
					<img :src="item.image_src">
				</navigator>
			</swiper-item>
		</swiper>

		<view class="nav-list">
			<view v-for="(item,index) in navList" :key="index" @click="navClick(item.name)">
				<image :src="item.image_src" mode="scaleToFill"></image>
			</view>
		</view>

		<!-- 楼层区 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<image :src="item.floor_title.image_src" mode="" class="floor-title"></image>
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item"  v-for="(item2, i2) in item.product_list" :url="item2.url" :key="i2" v-if="i2 !== 0">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>



		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [],
				// 分类导航数据
				navList: [],
				//楼层区域
				floorList: [],
			};
		},
		methods: {
			async getSwiperData() {
				const result = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (result.data.meta.status !== 200) {
					return uni.$showMsg()
				}
				this.swiperList = result.data.message
			},
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
			},
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$shopMsg()
				  res.message.forEach(floor => {
				    floor.product_list.forEach(prod => {
				      prod.url = '/subpackage/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
				    })
				  })

				this.floorList = res.message
			},
			// 分类页点击
			navClick(cateName) {
				if (cateName === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			}
		},
		onLoad() {
			this.getSwiperData()
			this.getNavList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		padding: 20rpx;

		view {
			width: 128rpx;
			height: 140rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}
</style>
