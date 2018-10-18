export default function(){
	var app = this;
    //**! fix ie11 hashchange not work
    if ("-ms-scroll-limit" in document.documentElement.style && "-ms-ime-align" in document.documentElement.style) { 
        window.addEventListener("hashchange",
        function () {
            var currentPath = window.location.hash.slice(1);
            if (app.$route.path !== currentPath) {
                app.$router.replace(currentPath);
            }
        },
        false);
    }
}