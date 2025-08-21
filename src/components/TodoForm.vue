<template>
  <el-form @submit.prevent="onSubmit" :inline="true">
    <el-form-item label="新的待辦事項">
      <el-input
        v-model.lazy.trim="label"
        placeholder="請輸入待辦事項"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :icon="Plus">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { Plus } from '@element-plus/icons-vue';

const label = ref("");
const emit = defineEmits(['todo-add']);

function onSubmit() {
  if (label.value) {
    emit('todo-add', label.value);
    label.value = "";
  }
}
</script>
