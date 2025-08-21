<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import ToDoItemEditForm from './ToDoItemEditForm.vue';
import { Edit, Delete } from '@element-plus/icons-vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['checkbox-changed', 'item-deleted', 'item-edited']);
const isEditing = ref(false);

function onCheckboxChanged() {
  emit('checkbox-changed', props.id);
}

function onItemDeleted() {
  emit('item-deleted', props.id);
}

function onItemEdited(newLabel) {
  emit('item-edited', props.id, newLabel);
  isEditing.value = false;
}

function onCloseEditForm() {
  isEditing.value = false;
}
</script>

<template>
  <div class="todo-item">
    <el-card shadow="hover" :body-style="{ padding: '10px' }">
      <div v-if="!isEditing" class="item-content">
        <el-checkbox
          :model-value="done"
          @change="onCheckboxChanged"
          size="large"
        />
        <span :class="{ 'is-done': done }" class="item-label">{{ label }}</span>
        <div class="item-actions">
          <el-button type="primary" :icon="Edit" circle @click="isEditing = true" />
          <el-button type="danger" :icon="Delete" circle @click="onItemDeleted" />
        </div>
      </div>
      <ToDoItemEditForm
        v-else
        :id="id"
        :label="label"
        @item-edited="onItemEdited"
        @item-deleted="onItemDeleted"
        @close-edit-form="onCloseEditForm"
      />
    </el-card>
  </div>
</template>

<style scoped>
.todo-item {
  margin-bottom: 10px;
}

.item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.item-label {
  margin-left: 10px;
  flex-grow: 1;
}

.item-label.is-done {
  text-decoration: line-through;
  color: #a8abb2;
}

.item-actions {
  margin-left: auto;
}
</style>
