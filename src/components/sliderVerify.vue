<template>
    <div class="slide-verify" :style="{width: canvas_width + 'px'}" onselectstart="return false;">
        <!-- 图片加载遮蔽罩 -->
        <div :class="{'img-loading': isLoading}" :style="{height: canvas_height + 'px'}" v-if="isLoading">
            <i class="el-icon-loading"></i>
        </div>
        <!-- 认证成功后的文字提示 -->
        <div class="success-hint" :style="{height: canvas_height + 'px'}" v-if="verifySuccess">{{ successHint }}</div>
        <!--刷新按钮-->
        <div class="refresh-icon" @click="refresh">
            <i class="el-icon-refresh"></i>
        </div>
        <!--前端生成-->
        <template v-if="isFrontCheck">
            <!--验证图片-->
            <canvas ref="canvas" class="slide-canvas" :width="canvas_width" :height="canvas_height"/>
            <!--阻塞块-->
            <canvas ref="block" class="slide-block" :width="canvas_width" :height="canvas_height"/>
        </template>
        <!--后端生成-->
        <template v-else>
            <!--验证图片-->
            <img ref="canvas" class="slide-canvas" :width="canvas_width" :height="canvas_height"/>
            <!--阻塞块-->
            <img ref="block" :class="['slide-block', {'verify-fail': verifyFail}]"/>
        </template>
        <!-- 滑动条 -->
        <div class="slider"
             :class="{'verify-active': verifyActive, 'verify-success': verifySuccess, 'verify-fail': verifyFail}">
            <!--滑块-->
            <div class="slider-box" :style="{width: sliderBoxWidth}">
                <!-- 按钮 -->
                <div class="slider-button" id="slider-button" :style="{left: sliderButtonLeft}">
                    <!-- 按钮图标 -->
                    <div class="slider-button-icon"/>
                </div>
            </div>
            <!--滑动条提示文字-->
            <span class="slider-hint">{{ sliderHint }}</span>
        </div>
    </div>
</template>

<script>

/**
 * 食用方法：
 * @success=verifySuccess（data）
 * data.nonceStr为随机码
 * data.value为验证码
 *               打开前  this.$refs.sliderVerify.init()
 *
 * 例：
 * <el-dialog
 *                     title="验证码校验"
 *                     :visible.sync="openVerify"
 *                     width="25rem"
 *                     :show-close="false"
 *                     :close-on-click-modal="false"
 *                     :close-on-press-escape="false"
 *                     :append-to-body="true"
 *                     style="z-index: 2100">
 *                 <sliderVerify ref="sliderVerify" @success="verifySuccess"/>
 *             </el-dialog>
 */
import {checkImageCode, getCodeImg} from "@/api/captcha";

function sum(x, y) {
    return x + y;
}

function square(x) {
    return x * x;
}


export default {
    name: 'sliderVerify',
    props: {
        // 阻塞块长度
        blockLength: {
            type: Number,
            default: 42,
        },
        // 阻塞块弧度
        block_radius: {
            type: Number,
            default: 10,
        },
        // 画布宽度
        canvas_width: {
            type: Number,
            default: 320,
        },
        // 画布高度
        canvas_height: {
            type: Number,
            default: 155,
        },
        // 滑块操作提示
        sliderHint: {
            type: String,
            default: '向右滑动',
        },
        // 可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5，若为 -1 则不进行机器判断
        accuracy: {
            type: Number,
            default: 3,
        },
        // 图片资源数组
        imageList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            // 前端校验
            isFrontCheck: false,
            // 校验进行状态
            verifyActive: false,
            // 校验成功状态
            verifySuccess: false,
            // 校验失败状态
            verifyFail: false,
            // 阻塞块对象
            blockObj: null,
            // 图片画布对象
            canvasCtx: null,
            // 阻塞块画布对象
            blockCtx: null,
            // 阻塞块宽度
            block_width: this.blockLength * 2,
            // 阻塞块的横轴坐标
            block_x: undefined,
            // 阻塞块的纵轴坐标
            block_y: undefined,
            // 图片对象
            image: undefined,
            // 移动的X轴坐标
            originX: undefined,
            // 移动的Y轴做坐标
            originY: undefined,
            // 拖动距离数组
            dragDistanceList: [],
            // 滑块箱拖动宽度
            sliderBoxWidth: 0,
            // 滑块按钮距离左侧起点位置
            sliderButtonLeft: 0,
            // 鼠标按下状态
            isMouseDown: false,
            // 图片加载提示，防止图片没加载完就开始验证
            isLoading: true,
            // 时间戳，计算滑动时长
            timestamp: null,
            // 成功提示
            successHint: '',
            // 随机字符串
            nonce_str: undefined,
        };
    },

    mounted() {
        this.init();
    },
    methods: {
        /* 初始化*/
        init() {
            this.initParams();
            this.initDom();
            this.bindEvents();
        },
        initParams() {
            this.isFrontCheck = false
            // 校验进行状态
            this.verifyActive = false
            // 校验成功状态
            this.verifySuccess = false
            // 校验失败状态
            this.verifyFail = false
            // 阻塞块对象
            this.blockObj = null
            // 图片画布对象
            this.canvasCtx = null
            // 阻塞块画布对象
            this.blockCtx = null
            // 阻塞块宽度
            this.block_width = this.blockLength * 2
            // 阻塞块的横轴坐标
            this.block_x = undefined
            // 阻塞块的纵轴坐标
            this.block_y = undefined
            // 图片对象
            this.image = undefined
            // 移动的X轴坐标
            this.originX = undefined
            // 移动的Y轴做坐标
            this.originY = undefined
            // 拖动距离数组
            this.dragDistanceList = []
            // 滑块箱拖动宽度
            this.sliderBoxWidth = 0
            // 滑块按钮距离左侧起点位置
            this.sliderButtonLeft = 0
            // 鼠标按下状态
            this.isMouseDown = false
            // 图片加载提示，防止图片没加载完就开始验证
            this.isLoading = true
            // 时间戳，计算滑动时长
            this.timestamp = null
            // 成功提示
            this.successHint = ''
            // 随机字符串
            this.nonce_str = undefined
        },
        /* 初始化DOM对象*/
        initDom() {
            this.blockObj = this.$refs.block;
            if (this.isFrontCheck) {
                this.canvasCtx = this.$refs.canvas.getContext('2d');
                this.blockCtx = this.blockObj.getContext('2d');
                this.initImage();
            } else {
                this.getCaptcha();
            }
        },
        /* 后台获取验证码*/
        getCaptcha() {
            let self = this;
            //取后端默认值
            const data = {};
            getCodeImg(data).then((response) => {
                const data = response.data;
                this.nonce_str = data.nonce_str
                self.nonce_str = data.nonce_str;
                self.$refs.block.src = data.block_src;
                self.$refs.block.style.top = data.block_y + 'px';
                self.$refs.canvas.src = data.canvas_src;
            }).finally(() => {
                self.isLoading = false;
            });
        },
        /* 前端获取验证码*/
        initImage() {
            const image = this.createImage(() => {
                this.drawBlock();
                let {canvas_width, canvas_height, block_x, block_y, block_radius, block_width} = this;
                this.canvasCtx.drawImage(image, 0, 0, canvas_width, canvas_height);
                this.blockCtx.drawImage(image, 0, 0, canvas_width, canvas_height);
                // 将抠图防止最左边位置
                let yAxle = block_y - block_radius * 2;
                let ImageData = this.blockCtx.getImageData(block_x, yAxle, block_width, block_width);
                this.blockObj.width = block_width;
                this.blockCtx.putImageData(ImageData, 0, yAxle);
                // 图片加载完关闭遮蔽罩
                this.isLoading = false;
                // 前端校验设置特殊值
                this.nonce_str = 'loyer';
            });
            this.image = image;
        },
        /* 创建image对象*/
        createImage(onload) {
            const image = document.createElement('img');
            image.crossOrigin = 'Anonymous';
            image.onload = onload;
            image.onerror = () => {
                image.src = "data:image/png;base64,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";
            };
            image.src = this.getImageSrc();
            return image;
        },
        /* 获取imgSrc*/
        getImageSrc() {
            const len = this.imageList.length;
            return len > 0 ? this.imageList[this.getNonceByRange(0, len)] : `https://loyer.wang/view/ftp/wallpaper/${this.getNonceByRange(1, 1000)}.jpg`;
        },
        /* 根据指定范围获取随机数*/
        getNonceByRange(start, end) {
            return Math.round(Math.random() * (end - start) + start);
        },
        /* 绘制阻塞块*/
        drawBlock() {
            this.block_x = this.getNonceByRange(this.block_width + 10, this.canvas_width - (this.block_width + 10));
            this.block_y = this.getNonceByRange(10 + this.block_radius * 2, this.canvas_height - (this.block_width + 10));
            this.draw(this.canvasCtx, 'fill');
            this.draw(this.blockCtx, 'clip');
        },
        /* 绘制事件*/
        draw(ctx, operation) {
            const PI = Math.PI;
            let {block_x: x, block_y: y, blockLength: l, block_radius: r} = this;
            // 绘制
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
            ctx.lineTo(x + l, y);
            ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
            ctx.lineTo(x + l, y + l);
            ctx.lineTo(x, y + l);
            ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
            ctx.lineTo(x, y);
            // 修饰
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.stroke();
            ctx[operation]();
            ctx.globalCompositeOperation = 'destination-over';
        },
        /* 事件绑定*/
        bindEvents() {
            // 监听鼠标按下事件
            document.getElementById('slider-button').addEventListener('mousedown', (event) => {
                this.startEvent(event.clientX, event.clientY);
            });
            // 监听鼠标移动事件
            document.addEventListener('mousemove', (event) => {
                this.moveEvent(event.clientX, event.clientY);
            });
            // 监听鼠标离开事件
            document.addEventListener('mouseup', (event) => {
                this.endEvent(event.clientX);
            });
            // 监听触摸开始事件
            document.getElementById('slider-button').addEventListener('touchstart', (event) => {
                this.startEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
            });
            // 监听触摸滑动事件
            document.addEventListener('touchmove', (event) => {
                this.moveEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
            });
            // 监听触摸离开事件
            document.addEventListener('touchend', (event) => {
                this.endEvent(event.changedTouches[0].pageX);
            });
        },
        /* 校验图片是否存在*/
        checkImgSrc() {
            if (this.isFrontCheck) {
                return true;
            }
            return !!this.$refs.canvas.src;
        },
        /* 滑动开始事件*/
        startEvent(originX, originY) {
            if (!this.checkImgSrc() || this.isLoading || this.verifySuccess) {
                return;
            }
            this.originX = originX;
            this.originY = originY;
            this.isMouseDown = true;
            this.timestamp = +new Date();
        },
        /* 滑动事件*/
        moveEvent(originX, originY) {
            if (!this.isMouseDown) {
                return false;
            }
            const moveX = originX - this.originX;
            const moveY = originY - this.originY;
            if (moveX < 0 || moveX + 40 >= this.canvas_width) {
                return false;
            }
            this.sliderButtonLeft = moveX + 'px';
            let blockLeft = (this.canvas_width - 40 - 20) / (this.canvas_width - 40) * moveX;
            this.blockObj.style.left = blockLeft + 'px';
            this.verifyActive = true;
            this.sliderBoxWidth = moveX + 'px';
            this.dragDistanceList.push(moveY);
        },
        /* 滑动结束事件*/
        async endEvent(originX) {
            if (!this.isMouseDown) {
                return false;
            }
            this.isMouseDown = false;
            if (originX === this.originX) {
                return false;
            }
            // 开始校验
            this.isLoading = true;
            // 校验结束
            this.verifyActive = false;
            // 滑动时长
            this.timestamp = +new Date() - this.timestamp;
            // 移动距离
            const moveLength = parseInt(this.blockObj.style.left);
            // 限制操作时长5S，超出判断失败
            if (this.timestamp > 5000) {
                this.verifyFailEvent();
            } else
                // 人为操作判定
            if (!this.turingTest()) {
                this.verifyFailEvent();
            } else {
                // 是否前端校验
                if (this.isFrontCheck) {
                    const accuracy = this.accuracy <= 1 ? 1 : this.accuracy > 10 ? 10 : this.accuracy; // 容错精度值
                    const spliced = Math.abs(moveLength - this.block_x) <= accuracy; // 判断是否重合
                    if (!spliced) {
                        this.verifyFailEvent();
                    } else {
                        // 设置特殊值，后台特殊处理，直接验证通过
                        this.$emit('success', {nonce_str: this.nonce_str, value: moveLength});
                    }
                } else {
                    let data = {}
                    data.nonce_str = this.nonce_str
                    data.value = moveLength
                    const dataa = await checkImageCode(data)
                    if (String(dataa.code) === '1') {
                        this.verifySuccessEvent()
                        this.$emit('success', {nonce_str: this.nonce_str, value: moveLength});
                    } else {
                        this.verifyFailEvent(dataa.msg);
                    }

                }
            }

        },
        /* 图灵测试*/
        turingTest() {
            const arr = this.dragDistanceList; // 拖动距离数组
            const average = arr.reduce(sum) / arr.length; // 平均值
            const deviations = arr.map((x) => x - average); // 偏离值
            const stdDev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length); // 标准偏差
            return average !== stdDev; // 判断是否人为操作
        },
        /* 校验成功*/
        verifySuccessEvent() {
            this.isLoading = false;
            this.verifySuccess = true;
            const elapsedTime = (this.timestamp / 1000).toFixed(1);
            if (elapsedTime < 1) {
                this.successHint = `[成功]仅仅${elapsedTime}S，你的速度快如闪电`;
            } else if (elapsedTime < 2) {
                this.successHint = `[成功]只用了${elapsedTime}S，这速度简直完美`;
            } else {
                this.successHint = `[成功]耗时${elapsedTime}S，争取下次再快一点`;
            }
        },
        /* 校验失败*/
        verifyFailEvent() {
            this.verifyFail = true;
            this.$message.error("校验失败，请重试!")
            this.refresh();
        },
        /* 刷新图片验证码*/
        refresh() {
            // 延迟class的删除，等待动画结束
            setTimeout(() => {
                this.verifyFail = false;
            }, 500);
            this.isLoading = true;
            this.verifyActive = false;
            this.verifySuccess = false;
            this.blockObj.style.left = 0;
            this.sliderBoxWidth = 0;
            this.sliderButtonLeft = 0;
            if (this.isFrontCheck) {
                // 刷新画布
                let {canvas_width, canvas_height} = this;
                this.canvasCtx.clearRect(0, 0, canvas_width, canvas_height);
                this.blockCtx.clearRect(0, 0, canvas_width, canvas_height);
                this.blockObj.width = canvas_width;
                // 刷新图片
                this.image.src = this.getImageSrc();
            } else {
                this.getCaptcha();
            }
        },
    },
};
</script>

<style scoped>
.slide-verify {
    position: relative;
}

/*图片加载样式*/
.img-loading {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    animation: loading 1.5s infinite;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100px;
    background-color: #737c8e;
    border-radius: 5px;
}

@keyframes loading {
    0% {
        opacity: .7;
    }
    100% {
        opacity: 9;
    }
}

/*认证成功后的文字提示*/
.success-hint {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    color: #2CD000;
    font-size: large;
}

/*刷新按钮*/
.refresh-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 35px;
    height: 35px;
    cursor: pointer;
    background-size: 35px 470px;
}

/*验证图片*/
.slide-canvas {
    border-radius: 5px;
}

/*阻塞块*/
.slide-block {
    position: absolute;
    left: 0;
    top: 0;
}

/*校验失败时的阻塞块样式*/
.slide-block.verify-fail {
    transition: left 0.5s linear;
}

/*滑动条*/
.slider {
    position: relative;
    text-align: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
    border-radius: 5px;
}

/*滑动盒子*/
.slider-box {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid #1991FA;
    background: #D1E9FE;
    border-radius: 5px;
}

/*滑动按钮*/
.slider-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: background .2s linear;
    border-radius: 5px;
}

/*鼠标悬浮时的按钮样式*/
.slider-button:hover {
    background: #1991FA
}

/*鼠标悬浮时的按钮图标样式*/
.slider-button:hover .slider-button-icon {
    background-position: 0 -13px
}

/*滑动按钮图标*/
.slider-button-icon {
    position: absolute;
    top: 15px;
    left: 13px;
    width: 15px;
    height: 13px;
    background: url("data:image/jpeg;base64,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9K0+lafStPpWn0rT6Vp9K0+lafStPpWn0rT6Vp9K0+lafStPpWn0rT6Vp9LEQggiQzhjLx+8BKHPOsDJPUBuZyRXquDknxe8BKHPOsDJPUBuZyRXquDknxe8BKHPOsDJPUBuZyRXquDknxe8BKHPOsDJPUBuZyRXquDknxe8BKHPOsDJPUBuZyRXquDknxe8BKHPOsDda5ActyoirVcHJPi94CUOedZMETKli/1/F7wEoc86y9mQdGxwTnw+8BKHPOtjUYw+C3g94CUOedcKN8QH/RH8/X7wEoc8663HjTExNRLpDWTL6W67u00kv4Bj1IfAo1NOR+/lGIDSQRpuX/WQcaLCO1BgP6M2Xh3wHyiN8CRmjSNUITzAYh6EOUeHB0YaZIGyIRzKipQFYMiMWioFBAGEfRUIOETNE669jOzQJEEVhhERENumYBYSCid4YJg+Qgu8SeBaKrw+MH3ZTG+Ys+7LG3Z2aCJEnP8AB//aAAwDAQACAAMAAAAQ8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888wMo088888888888888888888888888888840888888888888888888888888888888888sc8888888888888888888888888888888888o88888888888888888888888888888888888Y888888888888888888888888888888888888888888888888888888888888g8MMMMMMMMM88888888888888888888888o8888888888888888888888888888888888o8888888888888888880888888888888888sw8888888888888888k88888888888888888s8MMMMMMMMM08888k8888888888888888888888888888k8888k8888888888888888888888888888k8888k8888888888888888888888888888k8888k8888888888888888888888888888s0888k888888888888888888888888888888884k8888888888888888888888888888888sss88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888oc0gM888888888888888888888888888888888888//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8QGT//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAECAQE/EBk//8QAKhABAAECBQUAAQQDAQAAAAAAAREAITFBUHGBMFFhkaFAIGCxwaDR8OH/2gAIAQEAAT8Q/wAPstAyVzGrWgiZPcIUblLfO4DOV/pXdZJuKUflOoCCBve4Jnx+wL4CmNkWabBV7lpDB32MVxBb9AwyY1a0S7jAfPsdzO1wRJGR15ZOSGwBXBB2fL9buZcbOifOw2oIkjI64DJAJXtUyZD5S/noO5lxs6J87DagiSMjrZIKEqZSRROQ6DknRdzLjZ0T52G1BEkZHW79cKFllQ2sPHSdzLjZ0T52G1BEkZHWi7IIiZddoEOSGU01BsEJhEcHpO5lxs6J87DagiSMjrVykksAWTI5cG0InBqQJhEcE6TuZcbOifOw2oIkjI61cpJLAFkyOXBtCJwakCYRHBOk7mXGzonzsNqCJIyOtXKTSwBZMjlwbQi8GpAmERwTpO5lxs6J87DagiSMjrV2k2wAxMjlwbQi8GpAmERwTpO5lxs6J87DagiSMjrV2k2wAxMjlwbQi8GpAmERwTpO5lxs6J87DagiSMjopyuksHdWxWMyI9epe6cAAzIH3+HAgQIECBAgQIECBAgQIECBgaEBBtDFAMIeHJOk7mXGzonzsNqCJIyOhyREZsIZmRm+hpSLL0vzvll86C7mXGzonzsNqCJIyOgyiiGbGAeVgDulPWxbsPQD3dxXQ3cy42dE+dhtQRJGR0B5VN5AFPb40V3MuNnRPnYbUESRkfz/APvEk+aMS3klhf6brxOX545VN4ABfT50V0+GB+AfJubUAAAAMA/PhFEMycE8jCPcKetg3cegnq5iOhunwwPwD5NzagAAABgGgyREYso5GZmekpSrL0vyvhh8aC6fDA/APk3NqAAAAGAaGcroLB2Rs1jMiffqHqnCAciA9/hwIECBAgQIECBAgQIECBAgYZIEwbyQSjCXltE9J0+GB+AfJubUAAAAMA1i80S2QLFn2cm0CxBqRJlVcXpOnwwPwD5NzagAAABgGsXmiWyBYs+zk2gWINSJMqri9J0+GB+AfJubUAAAAMA1i80S2QLFn2cm0CxBqRJlVcXpOnwwPwD5NzagAAABgGsXmiWyBYs+zk2gWINSJMqri9J0+GB+AfJubUAAAAMA1i80S2QLFn2cm0CxBqRJlVcXpOnwwPwD5NzagAAABgGsHs8XESyzJFs1DCacc+WEyq5vSdPhgfgHybm1AAAADANZnTaM2ERG80+TpOnwwPwD5NzagAAABgGskKUZB4Jp+pY3dWXounwwPwD5NzagAAABgGtIIiSOVRwDPlv6dB0+GB+AfJubUAAAAMA1xYeEwsAJwG4/WdPhgfgHybm1AAAADANdNhJoxcmyDcabsWLIdnwYriS/6C7BVhYA7uIeXYrudrIAAABgGviamCuM1eVsRp7CoDdpj4+Izkf7VmsldhQD9phSSIb2uSJ8/wCDMY3yEC7MQ9mJqGBYTCSBdgw2KGGpEslJBsTK/wCin0hhih2iJbGHe1BskEAsAm2czQ6SEAgkySZZQiKZa99ggUkmVwhIpUb92miRUmJH/mcwbSQhIoQYRGN9dnWXrKdjCSeGofyCUEwYizJbxQQLB2LDAYZHqmuGJIHMme8mdM9KGsFKtpuXwa/l9YEYkTGcTXo2+yRPmKtjDIuvMZ+FsKjQGWVlAP4D9j//2Q==") 0 -26px;
    background-size: 35px 470px
}

/*校验时的按钮样式*/
.verify-active .slider-button {
    height: 38px;
    top: -1px;
    border: 1px solid #1991FA;
}

/*校验时的滑动箱样式*/
.verify-active .slider-box {
    height: 38px;
    border-width: 1px;
}

/*校验成功时的滑动箱样式*/
.verify-success .slider-box {
    height: 38px;
    border: 1px solid #52CCBA;
    background-color: #D2F4EF;
}

/*校验成功时的按钮样式*/
.verify-success .slider-button {
    height: 38px;
    top: -1px;
    border: 1px solid #52CCBA;
    background-color: #52CCBA !important;
}

/*校验成功时的按钮图标样式*/
.verify-success .slider-button-icon {
    background-position: 0 0 !important;
}

/*校验失败时的滑动箱样式*/
.verify-fail .slider-box {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
    transition: width 0.5s linear;
}

/*校验失败时的按钮样式*/
.verify-fail .slider-button {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
    transition: left 0.5s linear;
}

/*校验失败时的按钮图标样式*/
.verify-fail .slider-button-icon {
    top: 14px;
    background-position: 0 -82px !important;
}

/*校验状态下的提示文字隐藏*/
.verify-active .slider-hint,
.verify-success .slider-hint,
.verify-fail .slider-hint {
    display: none;
}
</style>

