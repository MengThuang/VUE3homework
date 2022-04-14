export default {
  data() {
    return {
      baseUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'zhuang',
      qty:1
    }
  },
  methods: {
    addCart(id,qty = 1) {
      axios.post(`${this.baseUrl}/api/${this.path}/cart`, {
        "data": {
          "product_id": id,
          qty:this.qty
        }
      })
        .then(res => {
          this.productModal.hide()
          this.$emit('get-carts')
          this.qty = 1
        }).catch(err => {
          console.log(err);
        })
    },
    
  },
  mounted() {

  },
  props: ['tempProduct', 'toCurrency', 'productModal'],
  template: `<div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ tempProduct.title }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ tempProduct.category }}</span>
              <p>商品描述：{{ tempProduct.description }}</p>
              <p>商品內容：{{ tempProduct.content }}</p>
              <div class="h5" v-if="!tempProduct.price">{{ tempProduct.origin_price }} 元</div>
              <del class="h6" v-if="tempProduct.price">原價 {{ toCurrency(tempProduct.origin_price) }} 元</del>
              <div class="h5" v-if="tempProduct.price">現在只要 {{ toCurrency(tempProduct.price) }} 元</div>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control" min="1" v-model="qty">
                  <button type="button" class="btn btn-primary" @click="addCart(tempProduct.id)">加入購物車</button>
                </div>
              </div>
            </div>
            <!-- col-sm-6 end -->
          </div>
        </div>
      </div>
    </div>
  </div>`
}