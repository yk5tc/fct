let app = new Vue(
  {
    mounted: function() {
      let vue = this;
      vue.loadChargeNum();
      vue.choose(vue.charge_nums[0].giftPercent, vue.charge_nums[0].price, 0);
    },
    data: {
      showAlert: false, //显示提示组件
      msg: null, //提示的内容
      charge: config.charge,
      charge_nums: config.charge.rules,
      tab_num: 0,

      isOther: false,
      charge_num: 0,
      gift: 0,
      balance: 0,

      data_charge_num: 0,
      discount: config.charge.defaultGift,
      hasNum:false,

      // subText: '我要充值'

    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus();
        }
      }
    },
    watch: {
      charge_num: function (val, oldVal) {
        let vue = this, _num = 0;
        _num = parseFloat(val.toString().replace(/[^\d]/g,''));
        if(_num){
          vue.charge_num = _num;
        }else {
          vue.charge_num = '';
        }
        if(!(vue.tab_num == vue.charge_nums.length - 1) && (vue.charge_num > vue.charge.max || vue.charge_num < vue.charge.min)){
          vue.charge_num = oldVal;
        }
        if(vue.charge_num > 0){
          vue.hasNum = true;
        }else {
          vue.hasNum = false;
        }
        vue.gift = (parseFloat(vue.charge_num) * parseFloat(vue.discount)).toFixed(0);
        vue.balance = (parseFloat(vue.charge_num) + parseFloat(vue.gift)).toFixed(0);
      },
    },
    computed:{
    },
    methods: {
      toFloat(num) {
        let vue = this;
        if(num > 0){
          vue.data_charge_num = num.toFixed(2);
          return num.toFixed(2);
        }
        else {
          return '0.00';
        }

      },
      showText(item){
        let vue = this, flag = false;
        if(item.price == 0){
          flag = true;
        }
        return flag;
      },
      loadChargeNum(){
        let vue = this;
        let other = {
          'giftPercent': vue.discount,
          'price': 0,
        };
        vue.charge_nums.push(other);


      },
      choose(discount, value, num){
        let vue = this;
        vue.tab_num = num;
        if(parseFloat(value) == 0){
          value = '';
          vue.isOther = true;
          vue.discount = config.charge.defaultGift;
        }else {
          vue.isOther = false;
          vue.discount = discount;
        }
        vue.charge_num = value;

      },
      sub(){
        let vue = this,
          post_url = config.rechargeUrl,
          post_data = {
            'charge_num': vue.data_charge_num
          };
        vue.$refs.subpost.post(post_url, post_data);

      },
      postSuc(data, index){
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
      }

    },
  }
).$mount('#recharge');
