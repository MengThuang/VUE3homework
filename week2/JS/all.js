import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js'

const baseApi = "https://vue3-course-api.hexschool.io/v2";
const path = "zhuang";

const app = createApp({
    data(){
        return{
            username : "",
            password : ""
        }
    },
    methods: {
        login(){
            
            axios.post(`${baseApi}/admin/signin`,{
                username : this.username,
                password : this.password
            })
            .then(res=>{
                alert(res.data.message)
                console.log(res.data);
                const { token, expired } = res.data
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; `;
                window.location = "products.html"
            }).catch(err=>{
                alert(err.data.message);
            })
        },
        changePage(){
            window.location = "index.html"
        }
    },
    mounted() {
        
    },
})

app.mount("#app")