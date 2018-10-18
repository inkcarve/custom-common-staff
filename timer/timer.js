var Timer = function(){

        var vm = this,
        timeNow,
        timer,
        timerConfig;

        return {
            timeNow: timeNow,
            timerStart:false,
            cancel:function(){
                if(!this.timerStart)return;
                clearInterval(timer);
                timer = null;
                timeNow = null;
                this.timerStart=false;
                window.checkFunction(   
                    timerConfig.callBack_timeCancel
                )
            },
            restart:function(config){
                console.log(config);
                clearInterval(timer);
                this.timerStart=false;
                timer = undefined;
                timeNow = undefined;
                if(!config){
                    config=Object.assign({},timerConfig);
                }else{
                    timerConfig=Object.assign({},config);
                }
                this.start(config);
            },
            start: function(config) {
                if(!config)return;
                timeNow = Object.assign({},config.timeNow);
                var timeSlice = config.timeSlice,
                minutePer = 60 * 1000 / timeSlice,
                secondPer = 1000 / timeSlice,
                callBack_EverySlice = function(){},
                callBack_timeEnd = function(){};
                var timeDefault = timeNow.minute * minutePer + timeNow.second * secondPer;
                var maxTime = timeNow.minute * minutePer + timeNow.second * secondPer;
                if(!timerConfig){
                    timerConfig=Object.assign({},config);
                }
                if(window.checkFunction(config.callBack_EverySlice,true)){
                    callBack_EverySlice = config.callBack_EverySlice;
                }
                if(window.checkFunction(config.callBack_timeEnd,true)){
                    callBack_timeEnd = config.callBack_timeEnd;
                }
                // window.checkFunction(
                //     function() {
                //         callBack_EverySlice = config.callBack_EverySlice;
                //     }
                // );
                // window.checkFunction(
                //     function() {
                //         callBack_timeEnd = config.callBack_timeEnd;
                //     }
                // );
                timer = setInterval(function() {
                    window.log(function(){console.log('maxTime:' + maxTime);});
                    maxTime--;
                    timeNow.second = maxTime % minutePer;
                    timeNow.minute = Math.floor(maxTime / minutePer);
                    var percent = maxTime / timeDefault * 100;
                    callBack_EverySlice(timeNow,percent);
                    // window.log(()=>{console.log('timer maxTime: '+maxTime);});
                    // defered.resolve(timeNow);
                    // console.log('timeNow.second:'+timeNow.second);
                    // console.log('timeNow.minute:'+timeNow.minute);
                    if (maxTime <= 0) {
                        clearInterval(timer);
                        timer = undefined;
                        this.timerStart=false;
                        callBack_timeEnd(timeNow);
                    }
                }, timeSlice);
                this.timerStart=true;
                // return defered.promise;
            }
        }

    }

export default Timer;

/* timerConfig example:
{   
    timeNow:{minute:5,second:0} //起始時間
    timeSlice: 1000, //timer 單位
    callBack_EverySlice(timeNow, percent) {},
    callBack_timeEnd:function(){},
    callBack_timeCancel:function(){}
}
*/