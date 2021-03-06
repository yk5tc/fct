Vue.component('star',
  {
    template: '#m_star',
    data(){
      return {
        stars_num: 5,
        stars_msg:['非常差','很差','一般','很好','非常好'],
        stars_chosen_msg: '',
        stars_chosen: 0,
      }
    },
    mounted() {
      let vue= this;
    },
    methods:{
      c_star(num){
        let vue = this;
        vue.stars_chosen = num + 1;
        vue.stars_chosen_msg = vue.stars_msg[vue.stars_chosen - 1];
      },
    }
  }
);
Vue.component('m-textarea',
  {
    template: '#m_textarea',
    data(){
      return {
        content: ''
      }
    },
    mounted() {
      let vue= this;
    },
    methods:{
    }
  }
);
Vue.component('upload',
  {
    template: '#m_upload',
    data(){
      return {
        uploadItem: [],
        subUpload: [],
        maxNum: 5,
      }
    },
    mounted() {
      let vue= this;
    },
    methods:{
      delImg(index){
        let vue = this;
        vue.uploadItem.splice(index, 1);
        vue.subUpload.splice(index, 1);
      },
      fileChange(event){
        let vue = this, file = {};
        if (typeof event.target === 'undefined') {
          file = event[0];
        }
        else {
          file = event.target.files[0];
        }

        if(file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg'){
          vue.$emit('pop');
        }else {
          tools.imgCompress(file, vue.upload);
        }

      },
      upload(blob, filename){
        let vue = this;
        let formData = new FormData();
        formData.append('action', 'head');
        formData.append('file', blob, filename);
        tools.ajaxPost(config.uploadFileUrl, formData, vue.postSuc, vue.postBefore, vue.postError, {}, vue.postTip, false);
      },
      postSuc(data){
        let vue = this;
        vue.uploadItem.push(data.data.fullUrl);
        vue.subUpload.push(data.data.url);
      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
      },
    }
  }
);
let app = new Vue(
  {
    mounted: function() {
      let vue = this;
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      order_detail: config.order_detail,
      anonymous: false,
      is_break: false,

      // subText: '提交评论'
    },
    watch: {
    },
    methods: {
      postSuc(data){
        let vue = this;
      },
      postTip(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        vue.close_auto();
      },
      postBefore(){
        let vue = this;
      },
      postError(){
        let vue = this;
      },
      sub(){
        let vue = this, orderGoods_list = [];
        vue.order_detail.orderGoods.forEach((item, index) => {
          let _star = vue.$refs.star[index];
          let _text = vue.$refs.text[index];
          let _imgs = vue.$refs.uploadimg[index];
          let _obj = {};
          _obj.goodsId = item.goodsId;
          _obj.content = _text.content;
          _obj.descScore = _star.stars_chosen;
          _obj.picture = _imgs.subUpload;
          orderGoods_list.push(_obj);
        });

        if(!vue.is_break){
          let post_url = config.commentUrl,
            post_data = {
              'order_id': vue.order_detail.orderId,
              'express_score': vue.$refs.express.stars_chosen,
              'sale_score': vue.$refs.sale.stars_chosen,
              'has_anonymous': vue.anonymous,
              'products': JSON.stringify(orderGoods_list)
            };
          vue.$refs.subpost.post(post_url, post_data);
        }

      },
      succhandle(data){
        let vue = this;
        vue.msg = data.message;
        vue.showAlert = true;
        if(data.url){
          vue.close_auto(vue.linkto, data.url);
        }else {
          vue.close_auto();
        }
      },
      close(){
        this.showAlert = false;
      },
      close_auto(callback, obj){
        let vue = this;
        setTimeout(function () {
          vue.showAlert = false;
          if(callback){
            callback(obj);
          }

        }, 1500);

      },
      linkto(url){
        if(url){
          location.href = url;
        }
      },
      alert(){
        let vue = this;
        vue.msg = '文件格式不正确';
        vue.showAlert = true;
        vue.close_auto();
      }
    },
  }
).$mount('#ordercomment');
