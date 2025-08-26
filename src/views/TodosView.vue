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

    <div class="todo-categories">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="category-card">
            <template #header>
              <span>暫存區</span>
            </template>
            <draggable
              :list="todosByCategory.draft"
              group="todos"
              @change="onDragChange('draft', $event)"
              item-key="id"
            >
              <template #item="{ element }">
                <ToDoItem
                  :id="element.id"
                  :label="element.label"
                  :done="element.done"
                  @checkbox-changed="updateDoneStatus"
                  @item-deleted="deleteTodo"
                  @item-edited="editTodo"
                />
              </template>
            </draggable>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="category-card">
            <template #header>
              <span>解釋區</span>
            </template>
            <draggable
              :list="todosByCategory.explain"
              group="todos"
              @change="onDragChange('explain', $event)"
              item-key="id"
            >
              <template #item="{ element }">
                <ToDoItem
                  :id="element.id"
                  :label="element.label"
                  :done="element.done"
                  @checkbox-changed="updateDoneStatus"
                  @item-deleted="deleteTodo"
                  @item-edited="editTodo"
                />
              </template>
            </draggable>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card class="category-card">
            <template #header>
              <span>分析區</span>
            </template>
            <draggable
              :list="todosByCategory.analyze"
              group="todos"
              @change="onDragChange('analyze', $event)"
              item-key="id"
            >
              <template #item="{ element }">
                <ToDoItem
                  :id="element.id"
                  :label="element.label"
                  :done="element.done"
                  @checkbox-changed="updateDoneStatus"
                  @item-deleted="deleteTodo"
                  @item-edited="editTodo"
                />
              </template>
            </draggable>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="category-card">
            <template #header>
              <span>總結區</span>
            </template>
            <draggable
              :list="todosByCategory.summary"
              group="todos"
              @change="onDragChange('summary', $event)"
              item-key="id"
            >
              <template #item="{ element }">
                <ToDoItem
                  :id="element.id"
                  :label="element.label"
                  :done="element.done"
                  @checkbox-changed="updateDoneStatus"
                  @item-deleted="deleteTodo"
                  @item-edited="editTodo"
                />
              </template>
            </draggable>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-card class="box-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>清單摘要</span>
          <el-text type="info" size="small">{{ listSummary }}</el-text>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js'
import ToDoItem from '../components/ToDoItem.vue'
import TodoForm from '../components/TodoForm.vue'
import draggable from 'vuedraggable'

export default {
  name: 'TodosView',
  components: {
    ToDoItem,
    TodoForm,
    draggable
  },
  setup() {
    const todoStore = useTodoStore()
    return {
      todoStore
    }
  },
  computed: {
    todosByCategory() {
      return this.todoStore.todosByCategory
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
    },
    onDragChange(newCategory, evt) {
      // 跨區拖動時，正確移除/新增並排序
      if (evt.added && evt.added.element && evt.added.element.id) {
        const itemId = evt.added.element.id
        const item = this.todoStore.todoItems.find(t => t.id === itemId)
        if (item) {
          // 更新 category
          item.category = newCategory
          item.updatedAt = new Date().toISOString()
          // 先移除
          const oldIndex = this.todoStore.todoItems.findIndex(t => t.id === itemId)
          this.todoStore.todoItems.splice(oldIndex, 1)
          // 計算目標插入位置
          const targetIds = this.todosByCategory[newCategory].map(t => t.id)
          let insertIndex = this.todoStore.todoItems.findIndex(t => t.id === targetIds[evt.added.newIndex])
          if (insertIndex === -1) insertIndex = this.todoStore.todoItems.length
          this.todoStore.todoItems.splice(insertIndex, 0, item)
        }
      }
    }
  }
}
</script>

<style scoped>
.todos-view {
  padding: 10px;
}
.todo-categories {
  margin-top: 20px;
}
.category-card {
  min-height: 200px;
}
</style>
