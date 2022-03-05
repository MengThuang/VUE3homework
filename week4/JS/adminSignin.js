import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js'
const baseApi = 'https://vue3-course-api.hexschool.io/v2'
const path = 'zhuang'

const app = createApp({
    data() {
        return {
            username : "", // 帳號
            password : "", // 密碼
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
                // 取出token與過期時間
                const {token,expired} = res.data
                document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;

                window.location = "week4_adminProducts.html"
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

// 分頁元件 V
// 產品新增、編輯元件
// 刪除元件