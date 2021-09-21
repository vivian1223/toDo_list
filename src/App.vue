<template>
  <div class="home-bg-theme py-7">
    <main class="col-4 mx-auto bg-info">
      <h1
        class="
          bg-primary
          font-white font-bold font-medium
          text-center
          py-1
          mb-2
        "
      >
        紀錄讓你的日常更美好
      </h1>
      <div class="bg-white">
       <TabComponent @show-to-do="(status)=> showToDoFilter(status)"></TabComponent>
       <div class="px-8 pb-3  position-relative">
         <todo-list-component  :todo-filter="toDoFilter"
         v-model:temp-to-do="tempToDo"
         @complete-to-do="completeToDo"
         @edit-to-do="editToDo" @done-edit="doneEdit"
         @delete-to-do="deleteToDo"></todo-list-component>
         <add-to-do-component @show-modal="showModal"></add-to-do-component>
       </div>
      </div>
    </main>
    <modal-component :modal-status="modalStatus"
    v-model:temp-to-do="tempToDo"
    @add-to-do="addToDo"></modal-component>
  </div>
</template>

<script>
import TabComponent from '@/components/TabComponent.vue';
import TodoListComponent from '@/components/TodoListComponent.vue';
import AddToDoComponent from '@/components/AddToDoComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';

export default {
  name: 'App',
  components: {
    TabComponent,
    TodoListComponent,
    AddToDoComponent,
    ModalComponent,
  },
  data() {
    return {
      apiPath: 'https://guarded-hamlet-24255.herokuapp.com/todo6',
      // modal目前是否為開啟
      modalStatus: false,
      toDoList: [],
      // 到時候要拿來編輯用的值
      tempToDo: {
        toDo: '',
      },
      // 頁面狀態，用來判斷觸發渲染時，陣列filter會回傳什麼值
      status: 'incomplete',
    };
  },
  provide() {
    return {
      provideTempToDo: this.tempToDo,
    };
  },
  methods: {
    // 新增資料時打開 modal
    showModal() {
      this.modalStatus = true;
    },
    // 新增todo
    addToDo() {
      this.modalStatus = false;
      if (this.tempToDo.toDo === '') {
        return;
      }
      const obj = {};
      obj.toDo = this.tempToDo.toDo;
      obj.status = 'incomplete';
      obj.id = new Date().getTime();
      this.toDoList.push(obj);
      this.tempToDo = {};
      this.axios
        .post(this.apiPath, obj)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
    // 刪除todo
    deleteToDo(item) {
      const { id } = item;
      const index = this.toDoList.findIndex((toDoItem) => toDoItem.id === id);
      this.toDoList.splice(index, 1);
      this.axios
        .delete(`${this.apiPath}/${item.id}`)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
    // 完成todo
    completeToDo(item) {
      // eslint-disable-next-line no-param-reassign
      item.status = 'completed';
      this.axios
        .patch(`${this.apiPath}/${item.id}`, item)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
    // 取得資料
    getData() {
      this.axios
        .get(this.apiPath)
        .then((res) => {
          this.toDoList = res.data;
        })
        .catch((err) => console.log(err));
    },
    // 根據點擊內容決定頁面呈現的內容，
    // 由於我們有在 computed 監聽 status 了，
    // 所以當 status 的值有所變動 toDoFilter() 就會回傳新的陣列內容
    showToDoFilter(status) {
      switch (status) {
        case 'completed':
          this.status = 'completed';
          break;
        case 'ncomplete':
          this.status = 'incomplete';
          break;
        default:
          break;
      }
    },
    // 開啟編輯模式
    editToDo(toDo) {
      this.status = 'edit';
      // eslint-disable-next-line no-param-reassign
      toDo.preStatus = toDo.status;
      // eslint-disable-next-line no-param-reassign
      toDo.status = 'edit';
    },
    // 完成編輯
    doneEdit(toDo) {
      this.tempToDo.toDo = toDo.toDo;
      // eslint-disable-next-line no-param-reassign
      toDo.status = toDo.preStatus;
      this.status = 'completed';
      this.axios
        .patch(`${this.apiPath}/${toDo.id}`, this.tempToDo)
        // eslint-disable-next-line no-return-assign
        .then(() => this.tempToDo = {})
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.getData();
  },
  // 透過 computed 來監聽頁面狀況
  computed: {
    toDoFilter() {
      return this.toDoList.filter((item) => item.status === this.status);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/all.scss";
</style>
