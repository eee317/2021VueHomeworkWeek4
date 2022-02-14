import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';
const app={
    data(){
        return {
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        signin(){
            const apiUrl='https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(apiUrl,this.user)
            .then(res=>{
                console.log(res)
                const {token, expired}=res.data;
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
                alert(res.data.message);
                window.location='products_4_test2.html'
            })
            .catch(err=>{
                alert(err.data.message);
            })
        }
    }
}
createApp(app).mount('#app')