var tools = {
  animate: function (element, target, duration = 400, mode = 'ease-out', callback) {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
      callback = duration;
      duration = 400;
    }else if(duration instanceof String){
      mode = duration;
      duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
      callback = mode;
      mode = 'ease-out';
    }

    //获取dom样式
    var attrStyle = function(attr){
      if (attr === 'opacity') {
        return Math.round(tools.getStyle(element, attr, 'float') * 100);
      } else {
        return tools.getStyle(element, attr);
      }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    var rootSize = parseFloat(document.documentElement.style.fontSize);

    var unit = {};
    var initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(attr => {
      if (/[^\d^\.]+/gi.test(target[attr])) {
        unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
      }else{
        unit[attr] = 'px';
      }
      initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(attr => {
      if (unit[attr] == 'rem') {
        target[attr] = Math.ceil(parseInt(target[attr])*rootSize);
      }else{
        target[attr] = parseInt(target[attr]);
      }
    });


    var flag = true; //假设所有运动到达终点
    var remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
      Object.keys(target).forEach(attr => {
        var iSpeed = 0;  //步长
        var status = false; //是否仍需运动
        var iCurrent = attrStyle(attr) || 0; //当前元素属性址
        var speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
        var intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
        switch(mode){
          case 'ease-out':
            speedBase = iCurrent;
            intervalTime = duration*5/400;
            break;
          case 'linear':
            speedBase = initState[attr];
            intervalTime = duration*20/400;
            break;
          case 'ease-in':
            var oldspeed = remberSpeed[attr] || 0;
            iSpeed = oldspeed + (target[attr] - initState[attr])/duration;
            remberSpeed[attr] = iSpeed
            break;
          default:
            speedBase = iCurrent;
            intervalTime = duration*5/400;
        }
        if (mode !== 'ease-in') {
          iSpeed = (target[attr] - speedBase) / intervalTime;
          iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        }
        //判断是否达步长之内的误差距离，如果到达说明到达目标点
        switch(mode){
          case 'ease-out':
            status = iCurrent != target[attr];
            break;
          case 'linear':
            status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
            break;
          case 'ease-in':
            status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
            break;
          default:
            status = iCurrent != target[attr];
        }

        if (status) {
          flag = false;
          //opacity 和 scrollTop 需要特殊处理
          if (attr === 'opacity') {
            element.style.filter = 'alpha(opacity:' + (iCurrent + iSpeed) + ')';
            element.style.opacity = (iCurrent + iSpeed) / 100;
          } else if (attr === 'scrollTop') {
            element.scrollTop = iCurrent + iSpeed;
          }else{
            element.style[attr] = iCurrent + iSpeed + 'px';
          }
        } else {
          flag = true;
        }

        if (flag) {
          clearInterval(element.timer);
          if (callback) {
            callback();
          }
        }
      })
    }, 20);
  },
  showBack: function(callback){
    var requestFram;
    var oldScrollTop;

    document.addEventListener('scroll',() => {
      showBackFun();
    }, false)
    document.addEventListener('touchstart',() => {
      showBackFun();
    },{passive: true})

    document.addEventListener('touchmove',() => {
      showBackFun();
    },{passive: true})

    document.addEventListener('touchend',() => {
      oldScrollTop = document.body.scrollTop;
      moveEnd();
    },{passive: true})

    var moveEnd = function() {
      requestFram = requestAnimationFrame(() => {
        if (document.body.scrollTop != oldScrollTop) {
          oldScrollTop = document.body.scrollTop;
          moveEnd();
        }else{
          cancelAnimationFrame(requestFram);
        }
        showBackFun();
      })
    }

    //判断是否达到目标点
    var showBackFun = function(){
      if (document.body.scrollTop > 500) {
        callback(true);
      }else{
        callback(false);
      }
    }
  },
  loadMore: function(element, callback){
    var windowHeight = window.screen.height;
    var height;
    var setTop;
    var paddingBottom;
    var marginBottom;
    var requestFram;
    var oldScrollTop;

    document.body.addEventListener('scroll',function() {
      loadMore();
    }, false)
    //运动开始时获取元素 高度 和 offseTop, pading, margin
    element.addEventListener('touchstart',function() {
      height = element.offsetHeight;
      setTop = element.offsetTop;
      paddingBottom = tools.getStyle(element,'paddingBottom');
      marginBottom = tools.getStyle(element,'marginBottom');
    },{passive: true})

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove',function() {
      loadMore();
    },{passive: true})

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend',function() {
      oldScrollTop = document.body.scrollTop;
      moveEnd();
    },{passive: true})

    var moveEnd = function() {
      requestFram = requestAnimationFrame(function() {
        if (document.body.scrollTop != oldScrollTop) {
          oldScrollTop = document.body.scrollTop;
          loadMore();
          moveEnd();
        }else{
          cancelAnimationFrame(requestFram);
          //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
          height = element.offsetHeight;
          loadMore();
        }
      })
    }

    var loadMore = function() {
      if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
        callback();
      }
    }
  },
  getStyle: function(element, attr, NumberMode = 'int'){
    var target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
      target = element.scrollTop;
    }else if(element.currentStyle){
      target = element.currentStyle[attr];
    }else{
      target = document.defaultView.getComputedStyle(element,null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
  },
  getUrlKey:function(name){
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,''])[1].replace(/\+/g,'%20'))||null;
  },
  ajaxGet: function (url, callback, before) {
    jAjax({
      type:'get',
      url:url,
      timeOut:5000,
      before:function(){
        if(before){
          before();
        }
      },
      success:function(data){
        if(data){
          data = JSON.parse(data);
          if(parseInt(data.code) == 200){
            callback(data);
          }else {
            console.log('false')
          }
        }

      },
      error:function(){
        console.log('error');
      }
    });
  }
};

function base64_encode(str) {
  var c = 0;
  var buf = [];
  var bits = 0;
  var n = 0;
  if (str.length > 0) {
    while (n < str.length) {
      var code = str.charCodeAt(n++);
      switch (++c) {
        case 1: {
          buf.push(tab[code >> 2]);
          bits = code & 0x3;
          if (n >= str.length) {
            buf.push(tab[bits << 4]);
            buf.push('==');
          }
        } break;
        case 2: {
          buf.push(tab[(code >> 4) | (bits << 4)]);
          bits = code & 0xf;
          if (n >= str.length) {
            buf.push(tab[bits << 2]);
            buf.push('=');
          }
        } break;
        case 3: {
          buf.push(tab[(code >> 6) | (bits << 2)]);
          buf.push(tab[code & 0x3f]);
          bits = 0;
          c = 0;
        } break;
      }
    }
  }
  return buf.join('');
}

/* lazyload */
let _util = {
  /**
   * debounce 函数去抖
   * @param fn
   * @param delay
   * @returns {function()}
   */
  debounce: function (fn, delay) {
    let timer
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay)
    }
  },
  /**
   * getPicInfo 快速获取图片宽高，图片加载完回调
   * @param options 对象类型，包含{src:string, fastCallback:fn, loadedCallback:fn, errorCallback:fn}
   * @options  src是图片地址，fastCallback是快速获取到图片宽高后的回调函数，loadedCallback是图片加载完的回调函数，errorCallback是图片加载失败的回调函数
   * @params {isError: boolean, width:number: height:number}，回调函数参数
   */
  getPicInfo: function (options) {
    let src = options.src || '',
      fastCallback = options.fastCallback,
      loadedCallback = options.loadedCallback,
      errorCallback = options.errorCallback,
      pic = new Image(),
      params = {
        isError: false,
        width: 0,
        height: 0
      },
      rollpolling = function () {
        if (params.isError || pic.width > 0 || pic.height > 0) {
          clearInterval(timer)
          params.width = pic.width
          params.height = pic.height
          fastCallback && fastCallback(params)
        }
      },
      timer
    pic.src = src
    pic.addEventListener('error', function (e) {
      params.isError = true
      errorCallback && errorCallback(params)
    }, false)
    if (pic.complete) {
      params.width = pic.width
      params.height = pic.height
      fastCallback && fastCallback(params)
      loadedCallback && loadedCallback(params)
    } else {
      pic.addEventListener('load', function () {
        params.width = pic.width
        params.height = pic.height
        loadedCallback && loadedCallback(params)
      }, false)
      timer = setInterval(rollpolling, 50)
    }
  }
};
class VueViewload {
  /**
   * @attr  emptyPic              base64空白图片
   * @param defaultPic            默认加载中图片
   * @param errorPic              加载失败图片
   * @param threshold             距离可视范围偏移值，负值表示提前进入，正值表示延迟进入
   * @param container             容器，必须是id名称，默认为window
   * @param effectFadeIn          是否渐入显示，默认是false
   * @param callback(ele, src)    进入可视区域后的回调函数，接收两个参数：ele表示元素，src表示加载的资源
   * @attr  selector              集合数组[{ele:'', src:''}]，每一项是一个对象，ele表示元素，src表示加载的资源
   * @attr  status                资源加载状态属性值，loading表示还没加载，loaded表示加载完，error表示加载失败
   * @attr  event                 支持的事件
   */
  constructor (options) {
    this.emptyPic = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    this.defaultPic = options && options.defaultPic || this.emptyPic
    this.errorPic = options && options.errorPic || this.emptyPic
    this.container = options && options.container || window
    this.threshold = options && parseInt(options.threshold, 10) || 0
    this.effectFadeIn = options && options.effectFadeIn || false
    this.callback = options && options.callback || new Function
    this.selector = options && options.selector || []
    this.event = ['scroll', 'resize']
    this.status = ['loading', 'loaded', 'error']
    this.delayRender = _util.debounce(this.render.bind(this), 200)
  }

  /**
   * inView 是否进入可视区域
   * @param ele
   * @returns {boolean}
   */
  inView (ele) {
    let isInView = false,
      rect = ele.getBoundingClientRect(),
      parentRect = this.container == window ? {left: 0, top: 0} : this.container.getBoundingClientRect(),
      viewWidth = this.container == window ? window.innerWidth : this.container.clientWidth,
      viewHeight = this.container == window ? window.innerHeight : this.container.clientHeight
    if (rect.bottom > this.threshold + parentRect.top && rect.top + this.threshold < viewHeight + parentRect.top && rect.right > this.threshold + parentRect.left && rect.left + this.threshold < viewWidth + parentRect.left) {
      isInView = true
    }
    return isInView
  }

  /**
   * bindUI 绑定UI事件
   */
  bindUI () {
    this.event.forEach((item, index) => {
      this.container.addEventListener(item, this.delayRender, false)
      if (this.container !== window && item == 'resize') {
        window.addEventListener(item, this.delayRender, false)
      }
    })
  }

  /**
   * unbindUI 删除UI事件
   */
  unbindUI () {
    this.event.forEach((item, index) => {
      this.container.removeEventListener(item, this.delayRender, false)
      if (this.container !== window && item == 'resize') {
        window.removeEventListener(item, this.delayRender, false)
      }
    })
  }

  /**
   * render 渲染资源
   * data-status属性 值包含：error加载失败，loading加载中，loaded加载完成
   */
  render () {
    if (!this.isLoadEvent) {
      this.isLoadEvent = true
      this.bindUI()
    }
    if (!this.selector.length) {
      this.unbindUI()
    }
    for (let i = 0; i < this.selector.length; i++) {
      let item = this.selector[i],
        eleType = item.ele.nodeName.toLowerCase()
      if (getComputedStyle(item.ele, null).display == 'none') {
        this.selector.splice(i--, 1)
        continue
      }
      if (eleType == 'img') {
        if (!item.ele.getAttribute('data-src')) {
          item.ele.setAttribute('data-src', item.src)
          item.ele.setAttribute('data-status', this.status[0])
        }
        if (!item.ele.getAttribute('src')) {
          item.ele.setAttribute('src', this.defaultPic)
        }
      }
      if (this.inView(item.ele)) {
        if (eleType == 'img') {
          _util.getPicInfo({
            src: item.src,
            errorCallback: (options) => {
              item.ele.src = this.errorPic
              item.ele.setAttribute('data-status', this.status[2])
            },
            loadedCallback: (options) => {
              if (this.effectFadeIn) {
                item.ele.style.opacity = 0
              }
              item.ele.src = options.isError ? this.errorPic : item.src
              item.ele.removeAttribute('data-src')
              item.ele.setAttribute('data-status', this.status[1])
              setTimeout(() => {
                item.ele.style.opacity = 1
                item.ele.style.transition = 'all 1s'
              }, 50)

            }
          })
          this.callback(item.ele, item.src)
        } else {
          typeof item.src == 'function' && item.src.call(item.ele)
        }
        this.selector.splice(i--, 1)
      }
    }
  }
}
Vue.directive('view', {
  bind(el, binding) {
    let resourceEles = {},options = {
      // threshold: -50
    },initRender;
    let containerName = binding.arg == undefined ? 'window' : binding.arg
    if (resourceEles[containerName] == undefined) {
      resourceEles[containerName] = []
    }
    resourceEles[containerName].push({
      ele: el,
      src: binding.value
    });
    Vue.nextTick(() => {
      if (typeof initRender == 'undefined') {
        initRender = _util.debounce(function () {
          for (let key in resourceEles) {
            options.container = key == 'window' ? window : document.getElementById(key);
            options.selector = resourceEles[key];
            new VueViewload(options).render();
          }
        }, 200)
      }
      initRender();
    })
  }
});
/* lazyload --- end */

/* pop */
let pop_html = '<div class="alet_container">' +
  '<section class="tip_text_container">' +
  '<div class="tip_text">{{ msg }}</div>' +
  '</section>' +
  '</div>';
Vue.component('pop',
  {
    template: pop_html,
    data() {
      return {
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg'],
    methods: {
      close(){
        this.$emit('close')
      }
    }
  }
);

let confirm_html = '<div class="confirm-container">' +
  '<section class="inner">' +
  '<div class="confirm-text">{{ msg }}</div>' +
  '<div class="confirm-btn">' +
  '<a href="javascript:;" class="cancel" @click="no()">取消</a>' +
  '<a href="javascript:;" class="ok" @click="ok()">确定</a>' +
  '</div></section></div>';
Vue.component('confirm',
  {
    template: confirm_html,
    data() {
      return {
        positionY: 0,
        timer: null,
      }
    },
    props: ['msg', 'callback', 'obj'],
    methods: {
      no(){
        this.$emit('no');
      },
      ok(){
        this.$emit('ok', this.callback, this.obj);
      }
    }
  }
);

let post_html = '<span class="post-container">' +
  '<span class="post-inner" v-if="postProcess">{{ txt }}...</span>' +
'<span class="post-inner" @click="sub()" v-else>{{ txt }}</span>' +
'</span>';
Vue.component('subpost',
  {
    template: post_html,
    props: {
      txt: {
        type: String,
        default: ''
      },
    },
    data(){
      return {
        postProcess: false,
      }
    },
    mounted() {
      let vue = this;
    },
    methods: {
      sub(){
        let vue = this;
        vue.$emit('callback');
      },
      post(url, data){
        let vue = this;
        jAjax({
          type:'post',
          url:url,
          data: data,
          timeOut:5000,
          before:function(){
            vue.postProcess = true;
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.$emit('succhandle',data);
              }else {
                vue.$emit('succhandle',data);
              }
            }
            vue.postProcess = false;
          },
          error:function(status, statusText){
            vue.postProcess = false;
          }
        });

      }
    }
  }
);
