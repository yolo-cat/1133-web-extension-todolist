<template>
  <div class="todos-view">
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
          v-for="item in allTodos"
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
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js'
import ToDoItem from '../components/ToDoItem.vue'
import TodoForm from '../components/TodoForm.vue'

export default {
  name: 'TodosView',
  components: {
    ToDoItem,
    TodoForm
  },
  setup() {
    const todoStore = useTodoStore()

    return {
      todoStore
    }
  },
  computed: {
    allTodos() {
      // 確保 todoItems 是陣列
      const items = this.todoStore.todoItems || []
      return Array.isArray(items) ? items : []
    },
    listSummary() {
      return this.todoStore.listSummary
    }
  },
  methods: {
    addTodo(newTodoLabel) {
      this.todoStore.addTodo(newTodoLabel)
    },
    updateDoneStatus(todoId) {
      this.todoStore.updateDoneStatus(todoId)
    },
    deleteTodo(todoId) {
      this.todoStore.deleteTodo(todoId)
    },
    editTodo(todoId, newLabel) {
      this.todoStore.editTodo(todoId, newLabel)
    }
  }
}
</script>

<style scoped>
.todos-view {
  max-width: 680px;
  margin: 40px auto;
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
