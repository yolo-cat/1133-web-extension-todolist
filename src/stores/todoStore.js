import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // 狀態
  const todoItems = ref([
    { id: 'todo-' + crypto.randomUUID(), label: '買牛奶', done: false },
    { id: 'todo-' + crypto.randomUUID(), label: '週日約會', done: false },
    { id: 'todo-' + crypto.randomUUID(), label: '週一會議', done: true },
    { id: 'todo-' + crypto.randomUUID(), label: '週二報告', done: false }
  ])

  // 計算屬性
  const listSummary = computed(() => {
    const total = todoItems.value.length
    const done = todoItems.value.filter(item => item.done).length
    return `總共 ${total} 個項目，已完成 ${done} 個。`
  })

  // 動作
  function addTodo(newTodoLabel) {
    todoItems.value.push({
      id: 'todo-' + crypto.randomUUID(),
      label: newTodoLabel,
      done: false
    })
  }

  function updateDoneStatus(todoId) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.done = !todo.done
    }
  }

  function deleteTodo(todoId) {
    todoItems.value = todoItems.value.filter(item => item.id !== todoId)
  }

  function editTodo(todoId, newLabel) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.label = newLabel
    }
  }

  return {
    todoItems,
    listSummary,
    addTodo,
    updateDoneStatus,
    deleteTodo,
    editTodo
  }
})
