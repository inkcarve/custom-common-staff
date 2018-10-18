import Timer from './timer/timer';
const timer = new Timer()
const axios = require('axios');
class KeepAlive {
    constructor() {
        this.keepAliveTimer = null;
        this.config = null;
    }

    start(config) {
        if (config) this.config = Object.assign({
                callBack_timeEnd:()=>{
                    if (this.config.callBack_keepAliveTimeEnd) {
                        this.config.callBack_keepAliveTimeEnd();
                    }
                    this.sendKeepAlive()
                }
            },
            config,
        );
        if (this.config) {
            this.keepAliveTimer = timer.restart(this.config)
        }
    }

    sendKeepAlive() {
        if (!this.config.sendKeepAliveConfig) return;
        axios(this.config.sendKeepAliveConfig)
            .then(res => {
                if (res.data.status === '1') {
                    this.start();
                } else {
                    if (this.config.callback_KeepAliveFail) {
                        this.config.callback_KeepAliveFail();
                    }
                }
            })
            .catch(err => {
                console.warn(err)
                if (this.config.callback_KeepAliveAjaxError) {
                    this.config.callback_KeepAliveAjaxError();
                }
            })
    }
}

export default new KeepAlive();

/* config example:

{
        timeNow: { minute: 5, second: 0 }, //起始時間
        timeSlice: 1000, //timer 單位
        sendKeepAliveConfig : {
            method: 'post',
            url: 'keepAlive',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        },
        callback_KeepAliveFail:function(){},
        callback_KeepAliveAjaxError:function(){},
        callBack_EverySlice:function(){},
        callBack_keepAliveTimeEnd:function(timeNow, percent){},
        callBack_timeCancel:function(){},
    }
*/