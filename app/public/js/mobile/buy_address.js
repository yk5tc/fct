let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.initdata();
      vue.defaultAddr();
    },
    watch: {
      address: function (val, oldVal) {
        if(!this.listloading){
          if(this.address && this.address.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    data: {
      address: [],
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      picked: '',
      // subText: '删除',
      del_index: null,

      listloading: true,
      nodata: false,

      showConfirm: false, /* 显示confirm组件 */
      addr_obj: {}
    },
    methods: {
      initdata(){
        let vue = this;
        vue.address = config.address;
        vue.listloading = false;
      },
      setDefault(item){
        let vue = this;
        vue.address.forEach((item, index) => {
          item.isDefault = 0;
        });
        item.isDefault = 1;
      },
      changeDefault(item){
        let vue = this, _url = config.defaultAddrUrl + '?id=' + item.id,
          _data = {};
        tools.ajaxPost(_url, _data, vue.postSuc, vue.postBefore, vue.postError, item, vue.postTip);
        /*jAjax({
          type:'post',
          url:config.defaultAddrUrl + '?id=' + item.id,
          data: {},
          timeOut:5000,
          before:function(){
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              if(parseInt(data.code) == 200){
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
                vue.setDefault(item);
                vue.defaultAddr();
              }else {
                vue.msg = data.message;
                vue.showAlert = true;
                vue.close_auto();
              }
            }
          },
          error:function(status, statusText){
          }
        });*/
      },
      postSuc(data, item){
        let vue = this;
        vue.setDefault(item);
        vue.defaultAddr();
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

      edit(item){
        let vue = this;
        location.href = config.editUrl + '?id=' + item.id;
      },
      del(obj){
        let vue = this,
          post_url = config.delAddrUrl + '?id=' + obj.addr_id,
          post_data = {};
        vue.del_index = obj.index;
        let _ref = 'subpost' + obj.index;
        vue.$refs[_ref][0].post(post_url, post_data);

      },
      confirm(item, callback){
        let vue = this;
        vue.msg = '您确认要执行此操作？';
        vue.addr_obj = {
          'addr_id': item.o.id,
          'index': item.i
        };
        vue.callback = callback;
        vue.showConfirm = true;
      },
      no(){
        let vue = this;
        vue.showConfirm = false;
      },
      ok(callback, obj){
        let vue = this;
        vue.showConfirm = false;
        if(callback){
          callback(obj);
        }
      },
      addressStr(item){
        let vue = this;
        return item.province + item.cityId + item.townId + item.address;
      },
      defaultAddr(){
        let vue = this,
          _def = 0,
          _str = '';
        vue.address.forEach((item) => {
          _def = parseInt(item.isDefault);
          if(_def == 1){
            _str = vue.addressStr(item);
          }
        });
        vue.picked = _str;
      },

      succhandle(data){
        let vue = this;
        vue.address.splice(vue.del_index, 1);
        vue.defaultAddr();
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
      }
    },
  }
).$mount('#buy_address');
