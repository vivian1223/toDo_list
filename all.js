const app = Vue.createApp({
  data() {
    return {
      apiPath: "https://guarded-hamlet-24255.herokuapp.com/todo6",
      //modal目前是否為開啟
      modalStatus: false,
      toDoList: [],
      //到時候要拿來編輯用的值
      tempToDo: {
        toDo: "",
      },
      //頁面狀態，用來判斷觸發渲染時，陣列filter會回傳什麼值
      status: "incomplete",
    };
  },
  methods: {
    //新增資料時打開 modal
    showModal() {
      this.modalStatus = true;
    },
    //新增todo
    addToDo() {
      this.modalStatus = false;
      if (this.tempToDo.toDo == "") {
        return;
      }
      let obj = {};
      obj.toDo = this.tempToDo.toDo;
      obj.status = "incomplete";
      this.toDoList.push(obj);
      this.tempToDo = {};
      axios
        .post(this.apiPath, obj)
        .then(function (res) {})
        .catch((err) => console.log(err));
    },
    //刪除todo
    deleteToDo(item) {
      let id = item.id;
      let index = this.toDoList.findIndex((item) => item.id == id);
      this.toDoList.splice(index, 1);
      axios
        .delete(`${this.apiPath}/${item.id}`)
        .then((res) => {})
        .catch((err) => console.log(err));
    },
    //完成todo
    completeToDo(item) {
      item.status = "completed";
      axios
        .patch(`${this.apiPath}/${item.id}`, item)
        .then((res) => {})
        .catch((err) => console.log(err));
    },
    //取得資料
    getData() {
      axios
        .get(this.apiPath)
        .then((res) => {
          this.toDoList = res.data;
        })
        .catch((err) => console.log(err));
    },
    //根據點擊內容決定頁面呈現的內容，
    //由於我們有在 computed 監聽 status 了，
    //所以當 status 的值有所變動 toDoFilter() 就會回傳新的陣列內容
    showToDoFilter(status) {
      console.log(status)
      switch (status) {
        case "completed":
          this.status = "completed";
          break;
        case "incomplete":
          this.status = "incomplete";
          break;
        default:
          break;
      }
    },
    //開啟編輯模式
    editToDo(toDo) {
      this.status = "edit";
      toDo.preStatus = toDo.status;
      toDo.status = "edit";
      this.tempToDo.toDo = toDo.toDo;
    },
    //完成編輯
    doneEdit(toDo) {
      toDo.status = toDo.preStatus;
      console.log(toDo);
      axios
        .patch(`${this.apiPath}/${toDo.id}`, this.tempToDo)
        .then((res) => {
          this.toDoList = res.data;
          this.tempToDo = {};
        })
        .catch((err) => console.log(err));
    },
  },
  //透過 computed 來監聽頁面狀況
  computed: {
    toDoFilter() {
      switch (this.status) {
        case "incomplete":
          return this.toDoList.filter((item) => item.status === "incomplete");
          break;
        case "completed":
          return this.toDoList.filter((item) => item.status === "completed");
          break;
        case "edit":
          return this.toDoList.filter((item) => item.status === "edit");
          break;
        default:
          break;
      }
    },
  },
  // DOM tree ready 時完成取得資料
  mounted() {
    this.getData();
  },
});

app.component("tabComponent", {
  data() {
    return {};
  },
  methods: {
    showToDo(status){
      this.$emit('showToDo',status)
    }
  },
  template: `<ul class="home-tab mb-3">
  <li><a href="#" class="home-tab-item" @click.prevent="showToDo('incomplete')">待辦事項</a></li>
  <li><a href="#" class="home-tab-item" @click.prevent="showToDo('completed')">已完成</a></li>
</ul>`,
});
app.mount("#app");
