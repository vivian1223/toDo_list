<template>
<ul class="position-relative">
  <li class="home-todo-item" v-for="toDo in todoFilter" :key="toDo.id">
      <p v-if="toDo.status != 'edit'">{{toDo.toDo}}</p>
      <input class="border-primary"
      :value="tempToDo.toDo"
      v-if="toDo.status == 'edit'" type="text">
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
</ul>
</template>

<script>
export default {
  data() {
    return {
      toDoList: [],
    };
  },
  props: ['todoFilter'],
  methods: {
    showToDo(status) {
      this.$emit('showToDo', status);
    },
    completeToDo(toDo) {
      this.$emit('completeToDo', toDo);
    },
    editToDo(toDo) {
      this.$emit('editToDo', toDo);
    },
    doneEdit(toDo) {
      this.$emit('doneEdit', toDo);
    },
    deleteToDo(toDo) {
      this.$emit('deleteToDo', toDo);
    },
  },
};
</script>
