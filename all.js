const app = Vue.createApp({
    data() {
        return {
            apiPath:'https://guarded-hamlet-24255.herokuapp.com/todo6',
            modalStatus:false,
            toDoList:[]
        }
    },
    methods: {
        addToDo(){
            this.modalStatus = true;
            let obj;
            

        }
    },
    created() {
        axios.get(this.apiPath)
        .then(res=>{this.toDoList = res.data;console.log(this.toDoList[1].todo )})
        .catch(err=>console.log(err))
    }
})
app.mount('#app')