const app = Vue.createApp({
  data() {
    return {
      apiPath: "https://guarded-hamlet-24255.herokuapp.com/todo6",
      modalStatus: false,
      toDoList: [],
      tempToDo: "",
    };
  },
  methods: {
    showModal() {
      document.scrollTop = 0;
      this.modalStatus = true;
    },
    addToDo() {
      this.modalStatus = false;
      if (this.tempToDo == "") {
        return;
      }
      let obj = {};
      obj.toDo = this.tempToDo;
      obj.status = "incomplete";
      axios
        .post(this.apiPath, obj)
        .then(function (res) {
          this.toDoList = res.data;
          obj = {};
          window.location.reload();
        })
        .catch((err) => console.log(err));
    },
    deleteToDo(item) {
      axios
        .delete(this.apiPath + `/${item.id}`)
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    },
    completeToDo(item) {
      item.status = "completed";
      console.log(item);
      axios
        .patch(this.apiPath+`/${item.id}`, item)
        .then((res) => {
          this.toDoList= res.data;
          window.location.reload();
        })
        .catch((err) => console.log(err));
    },
    toDoFilter(status) {
    //   if (status === "completed") {
    //     return this.toDoList.filter((item) => (item.status === "completed"));
    //   }

      if(status==="incomplete"){
          console.log(status)
          return this.toDoList.filter((item) => (item.status === "completed"))
        };
      
      
    },
  },
  //可以順利取回值，但為什麼不能渲染在畫面上呢？
  created() {
    axios
      .get(this.apiPath)
      .then((res) => {
        this.toDoList = res.data;
       this.toDoFilter('incomplete');
       console.log(this.toDoFilter('incomplete'))
      })
      .catch((err) => console.log(err));
  },
});
app.mount("#app");
