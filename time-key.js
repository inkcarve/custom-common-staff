angular.module("applyApp").factory('timeKey', ['$http', '$window', '$filter', '$location', '$rootScope', 'projectSetting',
    function($http, $window, $filter, $location, $rootScope, projectSetting) {
        var vm = this;
        var timeId = window.storage.timeId;
        var keyName = 'timeKey';
        var oldKey = window.storage.get(keyName+'_0');
        //**!! 裝置與寬度判斷處理 ---- start
        function set(){
            var newSeq=0;
            window.log(()=>{console.warn(oldKey)});
            if(!!oldKey){
                newSeq= parseInt(oldKey.split('_')[1])+1;
            }
            keyName=keyName+'_'+newSeq;
            timeId=timeId+'_'+newSeq;
            window.log(()=>{console.warn('keyName: '+keyName)});
            window.log(()=>{console.warn('timeId: '+timeId)});
            $rootScope.timeId = timeId;
            window.storage.set(keyName,timeId);
            projectSetting.timeId=timeId;
        }

        $window.onunload = function(){
            // debugger;
            window.storage.removeItem(keyName);
            // debugger;
        }


        return {
            //** strat logout_handler
            set: set,
            timeId: timeId,
        }
    }
]);