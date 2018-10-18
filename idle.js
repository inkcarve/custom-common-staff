const eachAddEventListener = function eachAddEventListener (object, events, callback) {
  events.forEach(function (event) {
    object.addEventListener(event, function (event) {
      callback(event)
    })
  })
}

const eachRemoveEventListener = function eachRemoveEventListener (object, events) {
  events.forEach(function (event) {
    object.removeEventListener(event)
  })
}

const Idle =  (function(){

        var vm = this;

        // idle handler
        var idleTimeDefault = 5 * 60 * 1000; //** idle time default 30 minute => /ms
        var warningTime = 0; //** time alert warn idle 10 minute => /ms
        var idleTimer;
        var idleTime = 0;
        var idle_end=true;
        var hadAlertWarning = false;
        var bindEventReset = false;
        var timeSlice = 1000; //** timer slice /ms
        var setting;
        var notReadIdleStorage = false;

        window.testIdle_time = 310 * 1000; //** use to test
        // window.testIdle = false; //** flag if open idle test
        // window.testIdle_stopTimer = false; //** use to test
        /* 已下複製到browser console介面使用
        window.testIdle_time = 20000;
        window.testIdle = true; 
        */
        var idle_handler = function idle_handler(reset) {
            // console.log(idleTimer);
            // console.log(angular.isDefined(idleTimer));
            console.log(reset)
            if (idleTimer) return;
            // console.log('!angular.isDefined(idleTimer)')
            if (!!reset) {
                idle_end = false;
                idleTime = idleTimeDefault;
                bindEventReset = true;
                clearInterval(idleTimer);
                idleTimer=undefined;
                console.log('idleTime: '+idleTime);
                hadAlertWarning = false;
                clearIdleData();
                setIdleStorage();
                // debugger;
          }

            
            var intervalCallback = function() {
                if(!!window.testIdle) {
                    idleTime = window.testIdleTime;
                    window.testIdle = false;
                    setIdleStorage();
                }
                if (!!window.testIdleStopTimer){
                    clearInterval(idleTimer);
                    idleTimer=undefined;
                    window.testIdleStopTimer=false;
                }
                idleTime -= timeSlice;
                // console.log('intervalCallback - idleTime:'+idleTime)
                // $rootScope.idleTime = idleTime;
                window.idleTime=idleTime;
                if(window.showIdleTime){
                    console.log('intervalCallback,idleTime: '+idleTime)
                    console.log('intervalCallback,idleTimeDefault: '+idleTimeDefault)
                    ;
                }
                action();
            };
            idleTimer = setInterval(intervalCallback, timeSlice);
        };
        // idle_handler(true);

        function action(option) {
            var ifReset= false, ifRenew=false;
            if(!!option){
                if(!!option.reset){
                    ifReset=true;
                }
                if(!!option.ifRenew){
                    ifRenew=true;
                }
            }
            if (idle_end){return;}
            if (idleTime <= 0) {
                clearInterval(idleTimer);
                clearIdleData();
                idle_end = true;

                if(setting.onIdleEnd){
                setting.onIdleEnd()
                }

            } else if (idleTime <= warningTime && !hadAlertWarning) {

                bindEventReset=false;
                if(setting.onIdleWarning){
                setting.onIdleWarning(idleTime)
                }
                hadAlertWarning = true;

            }else{

            }
        }

        function setIdleStorage() {
            var time = new Date().getTime();
            // console.log(idleTimer)
            if (idleTime <= 0 || idle_end) { return; }
            // window.log(()=>{console.warn('leaveTime: '+time);console.warn('leaveIdleTime: '+idleTime);})
            window.storage.set('leaveTime', time);
            window.storage.set('leaveIdleTime', idleTime);
        }

        function readIdleStorage(option) {
          console.log('readIdleStorage')
            if(notReadIdleStorage)return;
            var time = new Date().getTime();
            var leaveTime = window.storage.get('leaveTime');
            var leaveIdleTime = window.storage.get("leaveIdleTime");
            if (!leaveTime || !leaveIdleTime) return;
            var timeDiffer = time - leaveTime;
            var idleTime_test = Math.ceil((leaveIdleTime - timeDiffer) / timeSlice) * timeSlice;
            // window.log(()=>{console.log('timeDiffer: ' + timeDiffer);});
            // window.log(()=>{console.log('idleTime_test: ' + idleTime_test);});
            // window.log(()=>{console.log('idleTime: ' + idleTime);});
            if(!option)option={};
            var ifReset= false;
            if(!!option){
                if(!!option.reset){
                    ifReset=true;
                }
            }

            //** below call when idleTimer Stop
            if (idleTime_test < idleTime) {
                // console.log('idleTime_test < idleTime')
                
                clearInterval(idleTimer);
                
                if(idleTime_test < 0)idleTime_test = 0;
                idleTime = idleTime_test;

                if(setting.onIdleStopByBrowser){
                    setting.onIdleStopByBrowser()
                }
                
            }else{

            }
            if(idleTime > warningTime){
                // window.log(()=>{console.warn('readIdleStorage, idleTime > warningTime')});
            }else if(idleTime <= warningTime && idleTime_test>0){
                // window.log(()=>{console.warn('readIdleStorage, idleTime <= warningTime && idleTime_test>0')});
                ifReset=false;
            }else{
                // window.log(()=>{console.warn('readIdleStorage, idleTime <=0')});
                ifReset=false;
            }
            clearIdleData();
            resetIdleHandler(ifReset);
            setIdleStorage();
            // action(option);
        }

        function clearIdleData() {
            window.storage.notSetStorage = true;
            notReadIdleStorage = true;
            storage.removeItem('leaveTime');
            storage.removeItem('leaveIdleTime');
            notReadIdleStorage = false;
            window.storage.notSetStorage = false;
        }

        var resetIdleHandler = function resetIdleHandler(reset){
            if(!!idle_end)return;
            clearInterval(idleTimer);
            idleTimer = undefined;
            idle_handler(reset);
        }

        //** visibilitychange **//
        document.addEventListener("visibilitychange", function() {
            if (document.visibilityState !== undefined) {
                var state = document.visibilityState;
            } else if (document.webkitVisibilityState !== undefined) {
                var state = document.webkitVisibilityState;
            } else if (document.mosVisibilityState !== undefined) {
                var state = document.mosVisibilityState;
            } else {
                return;
            }

            if (state == 'hidden') {
                setIdleStorage();
            }
            if (state == 'visible') {
                readIdleStorage({reset:false});
            }

        });

        document.addEventListener("DOMContentLoaded", function(event) {
          // console.log("DOMContentLoaded")
        eachAddEventListener(window, ['mousemove','keydown','DOMMouseScroll','mousewheel','mousedown','touchstart','touchmove','scroll'], function (event) {
          // console.log(event.type)
          if (event.type === 'mousemove' && event.originalEvent && event.originalEvent.movementX === 0 && event.originalEvent.movementY === 0) {
              return; // Fix for Chrome desktop notifications, triggering mousemove event.
          }
          if(idleTime<=0){return;}
          if(!!bindEventReset){
              readIdleStorage({reset:true});
          }
        });
      })

        function forceIdle(){
            idle_end =true;
            clearIdleData();
            clearInterval(idleTimer);
            idleTimer = undefined;
        }

        return {
            //** strat idle_handler
            start: function(config) {
                // var store = setting.store;
                console.log('strat idle_handler');
                if(config){
                  setting = config;
                  if(config.idleTime)idleTimeDefault=config.idleTime;
                  if(config.warningTime)warningTime=config.warningTime;
                }
                idle_handler(true);
            },
            clear: clearIdleData,
            cancelTimer: function() {
                clearInterval(idleTimer);
            },
            resetIdleHandler:resetIdleHandler,
            //** 離開時送json前導
            // leaveApplySendJson: leaveApplySendJson,
            idle_end:function(){ return idle_end; },
            forceIdle:forceIdle,
            changeBindEventReset:function(value){
                bindEventReset=value;
            },
            checkIdleTimerLife:function(){
                return !!idle_handler;
            }
        }
    
})()

export default Idle;

/* setting example
{   
    idleTime: 5 * 60 * 1000, //ms
    onIdleWarning:function(){},
    onIdleStopByBrowser:function(){},
    onIdleEnd:function(){}
}
*/