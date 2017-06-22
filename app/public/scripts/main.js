var app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      this.getRankList();
      this.getprolist();
    },
    activated() {

    },
    deactivated() {

    },
    data: {
      ranks_list: [],
      pro_list: [],
      loading: false,
      refreshing: false,
      img_url: 'public/images',
      msg: 0
    },
    watch: {
    },
    methods: {
      change(index) {
        let vue = this;
        let _url = apis.products;
        if(index >= 0){
          _url += '?rank_id=' + index;
        }
        jAjax({
          type:'get',
          url:_url,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              console.log(data);
              vue.pro_list = (data);

            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });
      },
      getRankList() {
        let vue = this;
        jAjax({
          type:'get',
          url:apis.productsRank,
          timeOut:5000,
          before:function(){
            console.log('before');
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.ranks_list = (data);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log('error');
          }
        });

      },
      getprolist(msg) {
        let index = msg;
        let vue = this;
        let _url = apis.products;
        if(index > 0){
          _url += '?type_id=' + index;
        }
          jAjax({
            type:'get',
            url:_url,
            timeOut:5000,
            before:function(){
              console.log('before');
            },
            success:function(data){
              if(data){
                data = JSON.parse(data);
                console.log(data);
                vue.pro_list = (data);

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
).$mount('#main');
