let app = new Vue(
  {
    computed: {

    },
    mounted: function() {
      let vue = this;
      vue.initData();
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      withdrawalRecordList: [],
      pager: config.withdrawalRecordList.pager,
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      last_url: '',
      listloading: true,
      pagerloading: false,
      isPage: false,
      nodata: false,
      isLastPage: false
    },
    watch: {
      withdrawalRecordList: function (val, oldVal) {
        if(!this.listloading){
          if(this.withdrawalRecordList && this.withdrawalRecordList.length > 0){
            this.nodata = false;
          }else {
            this.nodata = true;
          }
        }
      }
    },
    methods: {
      initData(){
        let vue = this;
        vue.withdrawalRecordList = config.withdrawalRecordList.entries;
        vue.listloading = false;
      },
      getBefore(){
        let vue = this;
        vue.isPage ? vue.pagerloading = true : vue.listloading = true;
      },
      nextPage() {
        let vue = this;
        vue.preventRepeatReuqest = true;
        if(vue.pager.next > 0){
          var _url = config.withdrawalRecordUrl + '?page=' + vue.pager.next;
          if(_url !== vue.last_url){
            vue.last_url = _url;
            vue.isPage = true;
            tools.ajaxGet(_url, vue.pageSucc, vue.getBefore);
          }

        }else {
          vue.isLastPage = true;
        }
      },
      pageSucc(data){
        let vue = this;
        vue.pager = data.data.pager;
        vue.withdrawalRecordList = vue.withdrawalRecordList.concat(data.data.entries);
        vue.preventRepeatReuqest = false;
        vue.listloading = false;
        vue.pagerloading = false;
        vue.isPage = false;
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

    },
  }
).$mount('#withdrawalsrecord');
