Vue.component('m-swipe',
  {
    template: '#m_swipe',
    computed: {
    },
    watch: {
    },
    activated() {

    },
    deactivated() {

    },
    props: {
      swipeid: {
        type: String,
        default: ''
      },
      effect: {
        type: String,
        default: 'slide'
      },
      loop: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: 'horizontal'
      },
      pagination: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Number,
        default: 5000,
      },
      paginationType: {
        type: String,
        default: 'bullets'
      }
    },
    data(){
      return {
        dom:''
      }
    },
    mounted() {
      var That = this;
      this.dom = new Swiper('.' + That.swipeid, {
        //循环
        loop: That.loop,
        //分页器
        pagination: '.swiper-pagination',
        //分页类型
        paginationType: That.paginationType, //fraction,progress,bullets
        //自动播放
        autoplay: That.autoplay,
        //方向
        direction: That.direction,
        //特效
        effect: That.effect, //slide,fade,coverflow,cube
        autoplayDisableOnInteraction: false,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        height : window.innerHeight,
        lazyLoading: true
      })
    },
    components: {
    }
  }
);
var app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      this.getList();
      let swiper = this.$refs.swiper;
      if (swiper.dom) {
        this.swiper = swiper.dom;
      }
    },
    activated() {
      if (this.swiper) {
        this.swiper.startAutoplay();
      }
    },
    deactivated() {
      this.loop = false;
      if (this.swiper) {
        this.swiper.stopAutoplay();
      }
    },
    data() {
      return {
        refreshing: false,
        trigger: null,
        loading: false,
        count: 1,
        scroller: null,
        list: [],
        swiper: '',
        tops: []
      }
    },
    watch: {
      '$route' (to, from) {

      }
    },
    methods: {
      getList() {
        let vue = this;
        jAjax({
          type:'get',
          url:apis.slideimgs,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.tops = data;
              vue.list = (data);
              vue.loading = false;
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
    },
    components: {
    }
  }
).$mount('#welcome');
