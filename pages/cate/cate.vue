<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view class="left-scroll-view-item" :class="['left-scroll-view-item', i === active ? 'active' : '']"
						@click="activeChanged(i)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}"
				:scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3"  @click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 让滚动栏占视口高度百分百
				wh: 0,
				cateList: [],
				active: 0,
				// 二级分类
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 进行视口高度的赋值
			this.wh = sysInfo.windowHeight
			this.getCateList()
		},
		methods: {
			async getCateList() {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// 判断是否获取失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 转存数据
				this.cateList = res.message
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			activeChanged(i) {
				this.active = i;
				this.cateLevel2 = this.cateList[i].children;
				// 一切换分类滚动条要变为0,如果重置为0是不生效的
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			gotoGoodsList(item3) {
			  uni.navigateTo({
			    url: '/subpackage/goods_list/goods_list?cid=' + item3.cat_id
			  })
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 240rpx;
		}

		.left-scroll-view-item {
			background-color: #f7f7f7;
			line-height: 120rpx;
			text-align: center;
			font-size: 24rpx;

			&.active {
				background-color: white;
				position: relative;

				&::before {
					content: '';
					display: block;
					width: 6rpx;
					height: 60rpx;
					background-color: #c00000;
					// position: absolute;
					// top: 30rpx;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		.right-scroll-view {
			.cate-lv2 {
				background-color: white;

				.cate-lv2-title {
					font-size: 24rpx;
					font-weight: bold;
					text-align: center;
					padding: 30rpx 0;
				}
			}

			.cate-lv3-list {
				display: flex;
			 flex-wrap: wrap;

				.cate-lv3-item {
					width: 33.33%;
					margin-bottom: 20rpx;
			  display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 120rpx;
						height: 120rpx;
					}

					text {
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>
