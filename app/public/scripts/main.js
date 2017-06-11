var app = new Vue(
  {
    computed: {
    },
    mounted: function() {
      this.getRankList();
      this.getProlist();
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
      img_url: 'public/images'
    },
    watch: {
    },
    methods: {
      change(index) {

      },
      getRankList() {
        let vue = this;
        jAjax({
          type:"get",
          url:apis.products_r_rank,
          timeOut:5000,
          before:function(){
            console.log("before");
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
            console.log("error");
          }
        });

      },
      getProlist() {
        let vue = this;
        jAjax({
          type:"get",
          url:apis.allProducts,
          timeOut:5000,
          before:function(){
            console.log("before");
          },
          success:function(data){
            if(data){
              data = JSON.parse(data);
              vue.pro_list = (data);
            }else {
              console.log('no data')
            }

          },
          error:function(){
            console.log("error");
          }
        });

      },
    },
    components: {
    }
  }
).$mount('#main');
