import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';
import pagination from './pagination_4_test2.js'
const url='https://vue3-course-api.hexschool.io';
const api_path='peiying';
let productModal=null;
let delProductModal=null;

const app=createApp({
    components:{
        pagination
    },
    data(){
        return{
            isNew:false,
            products:[],
            tempProduct:{
                imagesUrl:[]
            },
            pagination:{}

        }
    },
    mounted(){
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
        const token=document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.check()
    },
    methods: {
        check(){
            const apiUrl=`${url}/v2/api/user/check`;
            axios.post(apiUrl)
            .then(res=>{
                this.getProduct();
            })
            .catch(err=>{
                console.dir(err);
                window.location='index.html'
            })
        },
        getProduct(page=1){
            const apiUrl=`${url}/v2/api/${api_path}/admin/products/?page=${page}`;
            axios.get(apiUrl)
            .then(res=>{
                console.log(res);
                this.products=res.data.products;
                this.pagination=res.data.pagination;
            })
            .catch(err=>{
                console.dir(err)
            })
        },
        openModal(state, item){
            if(state==='new'){
                this.isNew=true;
                this.tempProduct={
                    imagesUrl:[]
                };
                productModal.show();
            }else if(state==='edit'){
                this.isNew=false;
                this.tempProduct={...item};
                productModal.show();
            }else if(state==='delete'){
                this.tempProduct={...item};
                delProductModal.show();
            }
        },
        
        
    },
});
app.component('product-modal',{
    props:['temp-product','is-new'],
    template:'#productModalForVue',
    methods: {
        creatImg(){
            this.tempProduct.imagesUrl=[];
            this.tempProduct.imagesUrl.push('');
        },
        updata(){
            let apiUrl=`${url}/v2/api/${api_path}/admin/product`;
            let http='post';
            if(!this.isNew){
                apiUrl=`${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`;
                http='put';
            }
            axios[http](apiUrl,{data:this.tempProduct})
            .then(res=>{
                console.log(res);
                productModal.hide();
                this.$emit('get-product');
            })
            .catch(err=>{
                console.dir(err);
            })
        },
    },
})
app.component('del-product-modal',{
    props:['temp-product'],
    template:'#delProductModalForVue',
    methods: {
        deleteProduct(){
            const urlApi=`${url}/v2/api/${api_path}/admin/product/${this.tempProduct.id}`
            axios.delete(urlApi)
            .then(res=>{
                console.log(res)
                delProductModal.hide();
                this.$emit('get-product');
            })
            .catch(err=>{
                console.log(err)
                
            })
        }
    },
})
app.mount('#app');