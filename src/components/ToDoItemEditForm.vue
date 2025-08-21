<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { Check, Delete, Close } from '@element-plus/icons-vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['item-edited', 'item-deleted', 'close-edit-form']);
const newLabel = ref(props.label);

function onSubmit() {
  if (newLabel.value && newLabel.value !== props.label) {
    emit('item-edited', newLabel.value);
  }
  emit('close-edit-form'); // Always close after submit
}

function onDelete() {
  emit('item-deleted');
}

function onCancel() {
  emit('close-edit-form');
}
</script>

<template>
  <el-form @submit.prevent="onSubmit" :inline="true" class="edit-form">
    <el-form-item class="edit-form__input">
      <el-input v-model.lazy.trim="newLabel" />
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" native-type="submit" :icon="Check">儲存</el-button>
        <el-button type="danger" @click="onDelete" :icon="Delete">刪除</el-button>
        <el-button @click="onCancel" :icon="Close">取消</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.edit-form {
  display: flex;
  width: 100%;
  align-items: center;
}
.edit-form__input {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
