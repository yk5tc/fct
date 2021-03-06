var app = new Vue(
  {
    computed: {
      //判断手机号码
      rightPhoneNumber: function (){
        return /^1\d{10}$/gi.test(this.phoneNumber)
      }
    },
    data() {
      return {
        loginWay: true, //登录方式，默认短信登录
        phoneNumber: null, //电话号码
        userInfo: null, //获取到的用户信息
        userAccount: null, //用户名
        passWord: null, //密码
        showAlert: false, //显示提示组件
        msg: null, //提示的内容

        mobileCode: null, //短信验证码
        validate_token: null, //获取短信时返回的验证值，登录时需要
        computedTime: 0, //倒数记时
        captchaCodeImg: null, //验证码地址
        codeNumber: null, //验证码

        openid: config.openid,
        action: 'bind',
      }
    },
    methods: {
      //获取短信验证码
      getVerifyCode(){
        let vue = this;
        if (vue.rightPhoneNumber) {
          vue.computedTime = 60;
          vue.timer = setInterval(function (){
            vue.computedTime --;
            if (vue.computedTime <= 1) {
              clearInterval(vue.timer)
            }
          }, 1000);
          //发送短信验证码
          vue.$refs.coderef.post(apis.smsUrl, {
            'cellphone': vue.phoneNumber,
            'action': vue.action,
          });

        }
        else {
          vue.msg = '手机号码格式不正确';
          vue.showAlert = true;
          vue.close_auto();
        }
      },
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
      //发送登录信息
      mobileMsgLogin(){
        let vue = this;
        if (!this.rightPhoneNumber) {
          this.showAlert = true;
          this.msg = '手机号码不正确';
          vue.close_auto();
          return
        }

        vue.$refs.subpost.post(apis.userResource, formData.serializeForm('quickLogin'));

        //手机号登录


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
    }
  }
).$mount('#login');
