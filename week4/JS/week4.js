import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js'

const baseApi = 'https://vue3-course-api.hexschool.io/v2'
const path = 'zhuang'

let productModal = ""
let delModal = ""

const app = createApp({
    
    data() {
        return {
            products:{},
            tempProduct:{
                imagesUrl:[]
            },
            isNew:true,
            pagination:{}
            
        }
    },
    methods: {
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${baseApi}/api/user/check`)
                .then(res => {
                    this.getProducts()
                }).catch(err => {
                    alert(err.data.message)
                    window.location = 'adminSignin.html'
                })
        },
        logout(){
            axios.post(`${baseApi}/logout`)
            .then(res=>{
                window.location = 'adminSignin.html'
            }).catch(err=>{
                console.log(err);
            })
        },
        getProducts(page=1){
            axios.get(`${baseApi}/api/${path}/admin/products/?page=${page}`)
            .then(res=>{
                this.products = res.data.products
                this.pagination = res.data.pagination
            }).catch(err=>{
                console.log(err);
            })
        },
        openModal(page,product){
            if (page === '新增') {
                this.tempProduct={
                    imagesUrl:[]
                }
                this.isNew = 1
                productModal.show()
            } else if(page === '編輯'){
                this.tempProduct = {...product}
                this.isNew = 0
                productModal.show()
            } else if(page === '刪除'){
                this.tempProduct = {...product}
                delModal.show()
            }
        },
        
        
    },
    mounted() {
        this.checkLogin()
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {keyboard:false})
        delModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {keyboard:false})
    },
})

// 分頁元件
app.component('pagination',{
    props:["pages"],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{disabled:!pages.has_pre}" >
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="$emit('get-product',pages.current_page-1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pages.total_pages" :class="{active:page === pages.current_page}">
      <a class="page-link" href="#" @click.prevent="$emit('get-product',page)">{{page}}</a></li>
      <li class="page-item" :class="{disabled:!pages.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="$emit('get-product',pages.current_page+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
  
})
// 分頁元件

// 編輯元件
app.component('productModal',{
    template:'#templateProductModal',
    props:['tempProduct','isNew'],
    methods:{
        updateProduct(){
            let method = 'put'
            let url = `${baseApi}/api/${path}/admin/product/${this.tempProduct.id}`
            if (this.isNew) {
                method = 'post'
                url = `${baseApi}/api/${path}/admin/product`
            }
            axios[method](url,{data:this.tempProduct})
            .then(res=>{
                alert(res.data.message)
                this.$emit('get-products')
                productModal.hide()
                // this.getProducts()  
            }).catch(err=>{
                console.log(err.data);
            })
        },
        addImage(){
            this.tempProduct.imagesUrl = []
            this.tempProduct.imagesUrl.push('')
        },
    },
})
// 編輯元件

// 刪除元件
app.component('deleteModal',{
    template:'#tempDeleteModal',
    props:['tempProduct'],
    methods:{
        deleteProduct(){
            axios.delete(`${baseApi}/api/${path}/admin/product/${this.tempProduct.id}`)
                .then(res=>{
                    alert(res.data.message)
                    this.$emit('get-products')
                    delModal.hide()
                }).catch(err=>{
                    console.log(err);
                })
            },
    }
})
// 刪除元件

app.mount('#app')