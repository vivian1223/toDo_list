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
      obj.id = new Date().getTime();
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
      console.log(toDo)
    },
    //完成編輯
    doneEdit(toDo) {
      console.log(toDo);
      toDo.status = toDo.preStatus;
      this.status = "completed";
      axios
        .patch(`${this.apiPath}/${toDo.id}`, this.tempToDo)
        .then(res => this.tempToDo = {})
        .catch((err) => console.log(err));
    },
  },
  //透過 computed 來監聽頁面狀況
  computed: {
    toDoFilter() {
      console.log('toDofilter');
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
  created() {
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
    },
    getData(){
      this.$emit('getData')
    }
  },
  template: `<ul class="home-tab mb-3">
  <li><a href="#" class="home-tab-item" @click.prevent="showToDo('incomplete')">待辦事項</a></li>
  <li><a href="#" class="home-tab-item" @click.prevent="showToDo('completed')">已完成</a></li>
</ul>`,
});

app.component("todoListComponent", {
  data() {
    return {
      toDoList:[]
    };
  },
  props:['todoFilter','tempToDo'],
  methods: {
    showToDo(status){
      this.$emit('showToDo',status)
    },
    completeToDo(toDo){
      this.$emit('completeToDo',toDo)
    },
    editToDo(toDo){
      this.$emit('editToDo',toDo)
    },
    doneEdit(toDo){
      this.$emit('doneEdit',toDo)
    },
    deleteToDo(toDo){
      this.$emit('deleteToDo',toDo)
    }
  },
  template: `<ul class="position-relative">
  <li class="home-todo-item" v-for="toDo in todoFilter" :key="toDo.id">
      <p v-if="toDo.status != 'edit'">{{toDo.toDo}}</p>
      <input class="border-primary" v-model="tempToDo.toDo" v-if="toDo.status == 'edit'" type="text">
      <div class="home-todo-item-edit" v-if="toDo.status != 'edit'">
          <a @click.prevent="completeToDo(toDo)" href="#" class="link-primary ms-1"><i
                  class="fas fa-check"></i></a>
          <a @click.prevent="editToDo(toDo)" href="#" class="link-primary ms-1 fs-2"><i
                  class="fas fa-pen  fs-2"></i></a>
          <a @click.prevent="deleteToDo(toDo)" href="#" class="link-primary ms-1 fs-3 "><i
                  class="fas fa-times"></i></a>
      </div>
      <div v-if="toDo.status === 'edit'">
          <a @click.prevent="doneEdit(toDo)" href="#" class="link-primary ms-1"><i
              class="fas fa-check"></i></a>
      </div>
  </li>
</ul>`,
});

app.component("addToDoComponent", {
  data() {
    return {};
  },
  methods: {
    showModal(){
      this.$emit('showModal')
    }
  },
  template: `<a @click.prevent="showModal" href="#" class="home-add-todo">
  增加待辦 <i class="fas fa-plus"></i>
</a>`,
});

app.component("modalComponent", {
  data() {
    return {};
  },
  props:['modalStatus','tempToDo'],
  methods: {
    addToDo(){
      this.$emit('addToDo');
    }
  },
  template: `<div class="home-modal-bg-dark" v-if="modalStatus"></div>
  <div class="home-modal"v-if="modalStatus">
      <input type="text" v-model="tempToDo.toDo">
      <a href="#" @click.prevent="addToDo">
          儲存
      </a>
  </div>`,
});

app.mount("#app");
