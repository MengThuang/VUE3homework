import componentProductModal from './productModal.js'
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max, numeric } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
// 規則引入
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('numeric', numeric);
// 語言
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({ // 用來做一些設定
    generateMessage: localize('zh_TW'),
    validateOnInput: true //啟用 locale 
});
const app = Vue.createApp({
    components: {
        componentProductModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    data() {
        return {
            baseUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'zhuang',
            products: {},
            pagination: {},
            productModal: '',
            tempProduct: {},
            carts: {},
            isLoading: '',
            form: {
                user: {
                    name: "",
                    email: "",
                    tel: "",
                    address: ""
                },
                message: ""
            }
        }
    },
    methods: {
        getProducts(num = 1) {
            axios.get(`${this.baseUrl}/api/${this.path}/products/?page=${num}`)
                .then(res => {
                    this.products = res.data.products
                    this.pagination = res.data.pagination
                }).catch(err => {
                    alert(err.data.message);
                })
        },
        getCart() {
            axios.get(`${this.baseUrl}/api/${this.path}/cart`)
                .then(res => {
                    this.carts = res.data.data
                }).catch(err => {
                    alert(err.data.message);
                })
        },
        toCurrency(num) {
            const parts = num.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        },
        openModal(item) {
            this.productModal.show()
            this.tempProduct = item
            this.isLoading = item.id
            setTimeout(() => {
                this.isLoading = ''
            }, 1000)

        },
        delProduct(id) {
            this.isLoading = id
            axios.delete(`${this.baseUrl}/api/${this.path}/cart/${id}`)
                .then(res => {
                    this.getCart();
                    alert(res.data.message);
                    this.isLoading = ''
                }).catch(err => {
                    console.log(err);
                })
        },
        addCart(id, qty = 1) {
            this.isLoading = id
            axios.post(`${this.baseUrl}/api/${this.path}/cart`, {
                "data": {
                    "product_id": id,
                    qty
                }
            })
                .then(res => {
                    this.productModal.hide()
                    this.getCart()
                    this.isLoading = ''
                }).catch(err => {
                    console.log(err);
                })
        },
        editProduct(id, qty) {
            this.isLoading = id
            axios.put(`${this.baseUrl}/api/${this.path}/cart/${id}`, {
                "data": {
                    "product_id": id,
                    qty
                }
            })
                .then(res => {
                    this.getCart()
                    this.isLoading = ''
                    alert(res.data.message)
                }).catch(err => {
                    console.log(err);
                })
        },
        removeCart() {
            axios.delete(`${this.baseUrl}/api/${this.path}/carts`)
                .then(res => {
                    this.getCart()
                    alert(res.data.message)
                }).catch(err => {
                    alert(err.data.message)
                })
        },
        createOrder() {
            const order = this.form
            axios.post(`${this.baseUrl}/api/${this.path}/order`, { data: order })
                .then(res => {
                    alert(res.data.message)
                    this.$refs.form.resetForm()
                    this.getCart()
                    this.form.message = ''
                }).catch(err => {
                    console.log(err);
                    alert(err.data.message)
                })
        }
    },
    mounted() {
        this.getProducts()
        this.getCart()
        this.productModal = new bootstrap.Modal(document.querySelector('#productModal'), { keyboard: false })
    },

})

app.component('component_pagination', {
    methods: {
        changePage(num) {
            this.$emit('get-products', num)
        }
    },
    mounted() {
    },
    props: ['pagination'],
    template: '#pagination1'
})
app.component('VForm', VeeValidate.Form);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('VField', VeeValidate.Field);
app.mount('#app')