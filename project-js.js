export const setState = (state, setting)=>{
    state[setting.key] = setting.value
}



export const initStatus = (state, vm)=>{
  window.log(()=>{console.log('initState')})
  window.log(()=>{console.log(state)})
    state.userDataJson = Object.assign({},window.userDataJson);
    // this.status = {}
    if(window.demoVersion){
            // console.log(vm)
            let testStatus = vm.$route.query.testStatus
            state.userDataJson.status = testStatus
            // if(testStatus){
            //     state.userDataJson.status = testStatus
            // }else{
            //     state.userDataJson.status=null
            // }
            console.log(testStatus)
        }

        // if status
        // console.log('currentRoute')
        // console.log(vm.$router.currentRoute)
        if(state.userDataJson.status && vm.setting.status){
            if(vm.setting.status[state.userDataJson.status]){
                state.status = Object.assign({},vm.setting.status[state.userDataJson.status])
                if(state.userDataJson.status === 'undefinedError'){
                    if(vm.$router.currentRoute.name === 'signUp'){
                        state.status.modal = {
                            ...state.status.modal,
                            title:"註冊失敗<br><small>Registration Failure</small>",
                            body:`<h5>您註冊失敗，請洽玉山香港分行客服人員<br><small>Failed to register, please contact our customer service officer.</small></h5>
                            <h5 class="mt-3">錯誤代碼 / Error code : <span class="text-primary">${state.userDataJson.errorCode}</span></h5>`
                        }
                    }else if(vm.$router.currentRoute.name === 'login'){
                        state.status.modal = {
                            ...state.status.modal,
                            title:"登入失敗<br><small>Login Failure</small>",
                            body:`<h5>您登入失敗，請洽玉山香港分行客服人員<br><small>Failed to login, please contact our customer service officer.</small></h5>
                            <h5 class="mt-3">錯誤代碼 / Error code : <span class="text-primary">${state.userDataJson.errorCode}</span></h5>`
                        }
                    }else if(vm.$router.currentRoute.name === 'resetPassword'){
                        state.status.modal = {
                            ...state.status.modal,
                            title:"密碼重設失敗<br><small>Password reset Failure</small>",
                            body:`<h5>您密碼重設失敗，請洽玉山香港分行客服人員<br><small>Failed to reset your password, please contact our customer service officer.</small></h5>
                            <h5 class="mt-3">錯誤代碼 / Error code : <span class="text-primary">${state.userDataJson.errorCode}</span></h5>`
                        }
                    }

                }else if(state.userDataJson.status === 'loginPasswordError'){
                    state.status.alertDanger = `密碼輸入錯誤，還有${state.userDataJson.loginChance}次機會<br>Incorrect password, ${state.userDataJson.loginChance} attempt(s) remaining`
                }

                if(state.status.modal)state.status.modal.show = true;
            }

        }else{
          console.log('!state.userDataJson.status && vm.setting.status')
          state.status = {};
        }

        console.log('status')
        console.log(state.status)
}

export const getName = (name)=>{
    if(!name)return;
    return name.slice(0,1)+'*'+name.slice(2)
}

export const logout= ()=>{
    if(window.demoVersion){
        window.location.replace('login.html#/login')
    }else{
        window.location.replace('logout')
    }
}