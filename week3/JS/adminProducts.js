import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js'

const baseApi = 'https://vue3-course-api.hexschool.io/v2'
const path = 'zhuang'


let productModal = ""
let deletModal = ""

const app = createApp({
    data() {
        return {
            products : {},
            tempProduct : {
                imagesUrl:[]
            },
            isNew : true
        }
    },
    mounted() {
        this.checkLogin()
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard:false})
        deletModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {keyboard:false})
    },
    methods: {
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${baseApi}/api/user/check`)
            .then(res=>{
                this.getProduct()
            }).catch(err=>{
                alert(err.data.message);
                window.location = '/week3/JS/adminSignin.html'
            })
        },
        logout(){
            axios.post(`${baseApi}/logout`)
            .then(res=>{
                alert(res.data.message)
                window.location = "/week3/JS/adminSignin.html"
            }).catch(err=>{
                console.log(err.data);
            })
        },
        getProduct(){
            axios.get(`${baseApi}/api/${path}/admin/products/all`)
            .then(res=>{
                this.products = res.data.products
            }).catch(err=>{
                console.log(err);
            })
        },
        openModal(page, product){
            if (page === 'new') {
                this.tempProduct = {
                    imagesUrl:[]
                }
                this.isNew = true
                productModal.show()
            } else if (page === 'edit'){
                this.tempProduct = product
                this.isNew = false
                productModal.show()
            } else if (page === 'del') {
                this.tempProduct = product
                deletModal.show()
            }
        },
        updateProduct(){
            let url = `${baseApi}/api/${path}/admin/product`
            let method = 'post'
            if(!this.isNew){
                url = `${baseApi}/api/${path}/admin/product/${this.tempProduct.id}`
                method = 'put'
            }
            axios[method](url,{data:this.tempProduct})
            .then(res=>{
                alert(res.data.message)
                productModal.hide()
                this.getProduct()
            }).catch(err=>{
                console.log(err);
            })
        },
        deleteProduct(){
            axios.delete(`${baseApi}/api/${path}/admin/product/${this.tempProduct.id}`)
            .then(res=>{
                alert(res.data.message)
                deletModal.hide()
                this.getProduct()
            }).catch(err=>{
                console.log(err);
            })
        },
        addImage(){
            this.tempProduct.imagesUrl = []
            this.tempProduct.imagesUrl.push('')
        }

    },
})
app.mount("#app")