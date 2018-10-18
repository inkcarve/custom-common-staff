window.checkFunction = function checkFunction(fn,notFire) {
    if (!fn) return false;
    if (typeof fn !== 'function') return false;
    if (!notFire){fn();}
    return true;
}

window.log = function log(fn) {
    if (!!window.showLog) {
        window.checkFunction(fn);
    }
};

//** storage **//
window.storage = (function storage() {
    var timeId = new Date().getTime();
    var ifSessionStorage = window.sessionStorage !== undefined;
    var ifLocalStorage = window.localStorage !== undefined;
    var notSetStorage = false;
    console.warn('timeId: '+timeId);
    // console.log(ifSessionStorage);
    return {
        set: function(key, value) {
            // console.warn('set storage');
            if (notSetStorage) { return; }
            if (ifSessionStorage) {
                window.sessionStorage.setItem(timeId + '_' + key, value);
            }
            if (ifLocalStorage) {
                window.localStorage.setItem(timeId + '_' + key, value);
                //console.warn(timeId+'_'+key);
            }
            window.log(()=>{console.log('window.localStorage.getItem(timeId_key): '+window.localStorage.getItem(timeId + '_' + key))})
        },
        get: function(key) {
            if(!ifSessionStorage && !ifLocalStorage)return null;
            return window.localStorage.getItem(timeId + '_' + key) || window.sessionStorage.getItem(timeId + '_' + key);
        },
        clear: function() {
            window.localStorage.clear();
            window.sessionStorage.clear();
        },
        removeItem: function(key) {
            //console.warn('removeItem');
            //console.warn(timeId+'_'+key);
            window.localStorage.removeItem(timeId + '_' + key);
            window.sessionStorage.removeItem(timeId + '_' + key);
            //console.warn(window.localStorage.getItem(timeId+'_'+key));
        },
        notSetStorage: notSetStorage,
        timeId:timeId
    }
})();