<script setup>
import { ref, computed } from 'vue';
import ToDoItem from './components/ToDoItem.vue';
import TodoForm from './components/TodoForm.vue';

const todoItems = ref([
  { id: 'todo-' + crypto.randomUUID(), label: '買牛奶', done: false },
  { id: 'todo-' + crypto.randomUUID(), label: '週日約會', done: false },
  { id: 'todo-' + crypto.randomUUID(), label: '週一會議', done: true },
  { id: 'todo-' + crypto.randomUUID(), label: '週二報告', done: false }
]);

function addTodo(newTodoLabel) {
  todoItems.value.push({ id: 'todo-' + crypto.randomUUID(), label: newTodoLabel, done: false });
}

function updateDoneStatus(todoId) {
  const todo = todoItems.value.find(item => item.id === todoId);
  if (todo) {
    todo.done = !todo.done;
  }
}

function deleteTodo(todoId) {
  todoItems.value = todoItems.value.filter(item => item.id !== todoId);
}

function editTodo(todoId, newLabel) {
  const todo = todoItems.value.find(item => item.id === todoId);
  if (todo) {
    todo.label = newLabel;
  }
}

const listSummary = computed(() => {
  const total = todoItems.value.length;
  const done = todoItems.value.filter(item => item.done).length;
  return `總共 ${total} 個項目，已完成 ${done} 個。`;
});

</script>

<template>
  <el-container id="app-container">
    <el-header class="app-header">
      <h1>我的待辦事項</h1>
    </el-header>
    <el-main>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>新增事項</span>
          </div>
        </template>
        <TodoForm @todo-add="addTodo" />
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>待辦清單</span>
            <el-text type="info" size="small">{{ listSummary }}</el-text>
          </div>
        </template>
        <div class="todo-list">
          <ToDoItem
            v-for="item in todoItems"
            :key="item.id"
            :id="item.id"
            :label="item.label"
            :done="item.done"
            @checkbox-changed="updateDoneStatus"
            @item-deleted="deleteTodo"
            @item-edited="editTodo"
          />
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<style>
#app-container {
  max-width: 680px;
  margin: 40px auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
}

.app-header h1 {
  text-align: center;
  color: #409EFF;
  margin-bottom: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-list .el-card {
  margin-bottom: 10px;
}
</style>
