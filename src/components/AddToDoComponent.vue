<template>
  <a @click.prevent="showModal" href="#" class="home-add-todo">
  增加待辦 <i class="fas fa-plus"></i>
</a>
</template>

<script>
export default {
  name: 'AddToDoComponent',
  methods: {
    showModal() {
      this.$emit('showModal');
    },
  },
};
</script>
