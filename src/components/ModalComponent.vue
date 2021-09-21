<template>
<div class="home-modal-bg-dark" v-if="modalStatus"></div>
  <div class="home-modal" v-if="modalStatus">
      <input type="text" v-model="tempToDo.toDo">
      <a href="#" @click.prevent="addToDo">
          儲存
      </a>
  </div>
</template>

<script>
export default {
  name: 'ModalComponent',
  props: ['modalStatus'],
  methods: {
    addToDo() {
      this.$emit('addToDo');
    },
  },
};
</script>
