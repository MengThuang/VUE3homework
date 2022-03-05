import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js'
const baseApi = "https://vue3-course-api.hexschool.io/v2"
const path = "zhuang"

const app = createApp({
    data(){
        return{
            products:{},
            tempProduct:[]
        }
    },
    methods: {
        checkSignin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${baseApi}/api/user/check`)
            .then(res=>{
                this.getProducts()
            }).catch(err=>{
                alert(err.data.message);
                window.location = "index.html"
            })
        },
        logout(){
            axios.post(`${baseApi}/logout`)
            .then(res=>{
                alert(res.data.message)
                window.location = "index.html"
            }).catch(err=>{
                console.log(err.data);
            })
        },
        getProducts(){
            axios.get(`${baseApi}/api/${path}/admin/products/all`)
            .then(res=>{
                this.products = res.data.products
            }).catch(err=>{
                console.log(err.data.message);
            })
        }
    },
    mounted() {
        this.checkSignin()
    },
})

app.mount("#app")