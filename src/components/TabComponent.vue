<template>
  <ul class="home-tab mb-3">
  <li><a href="#" class="home-tab-item" @click.prevent="showToDo('incomplete')">待辦事項</a></li>
  <li class="-ms-1"><a href="#" class="home-tab-item"
  @click.prevent="showToDo('completed')">已完成</a></li>
</ul>
</template>

<script>
export default {
  name: 'TabComponent',
  methods: {
    showToDo(status) {
      this.$emit('showToDo', status);
    },
    getData() {
      this.$emit('getData');
    },
  },
};
</script>
