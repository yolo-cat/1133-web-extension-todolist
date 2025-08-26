<script setup>
import { useTodoStore } from './stores/todoStore.js'
import ToDoItem from './components/ToDoItem.vue'
import TodoForm from './components/TodoForm.vue'

// 使用 Pinia store
const todoStore = useTodoStore()

// 註冊 Chrome 擴充訊息監聽，收到訊息自動新增待辦
console.log('TodoList Extension: Vue app initializing...')

if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
  console.log('TodoList Extension: Chrome runtime available, setting up message listener')
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('TodoList Extension: Received message:', message)
    if (message.action === 'addTodo' && message.text) {
      console.log('TodoList Extension: Adding todo:', message.text)
      todoStore.addTodo(message.text)
      sendResponse({ success: true })
    }
  })
} else {
  console.log('TodoList Extension: Chrome runtime not available')
}

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
        <TodoForm @todo-add="todoStore.addTodo" />
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>待辦清單</span>
            <el-text type="info" size="small">{{ todoStore.listSummary }}</el-text>
          </div>
        </template>
        <div class="todo-list">
          <ToDoItem
            v-for="item in todoStore.todoItems"
            :key="item.id"
            :id="item.id"
            :label="item.label"
            :done="item.done"
            @checkbox-changed="todoStore.updateDoneStatus"
            @item-deleted="todoStore.deleteTodo"
            @item-edited="todoStore.editTodo"
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
