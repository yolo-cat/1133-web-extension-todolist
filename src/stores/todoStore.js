import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ChromeExtensionStorage } from '../utils/ChromeExtensionStorage.js'

export const useTodoStore = defineStore('todo', () => {
  // 初始化Chrome擴展優化的離線儲存
  const storage = new ChromeExtensionStorage()

  // 預設數據
  const defaultTodos = [
    { id: 'todo-' + crypto.randomUUID(), label: '買牛奶', done: false, createdAt: new Date().toISOString() },
    { id: 'todo-' + crypto.randomUUID(), label: '週日約會', done: false, createdAt: new Date().toISOString() },
    { id: 'todo-' + crypto.randomUUID(), label: '週一會議', done: true, createdAt: new Date().toISOString() },
    { id: 'todo-' + crypto.randomUUID(), label: '週二報告', done: false, createdAt: new Date().toISOString() }
  ]

  // 初始化狀態
  const todoItems = ref([])
  const isLoading = ref(true)
  const storageStats = ref({ used: 0, quota: 0, percentage: 0 })

  // 初始化數據載入
  const initializeData = async () => {
    try {
      isLoading.value = true
      const loadedTodos = await storage.load()

      // 確保 todoItems 始終是陣列
      if (Array.isArray(loadedTodos)) {
        todoItems.value = loadedTodos
      } else {
        console.log('No valid todos loaded, using default todos')
        todoItems.value = [...defaultTodos]
      }

      await updateStorageStats()
    } catch (error) {
      console.error('初始化數據失敗:', error)
      todoItems.value = [...defaultTodos]
    } finally {
      isLoading.value = false
    }
  }

  // 更新儲存統計
  const updateStorageStats = async () => {
    try {
      storageStats.value = await storage.getStorageStats()
    } catch (error) {
      console.error('更新儲存統計失敗:', error)
    }
  }

  // 監聽todoItems變化，自動保存
  watch(todoItems, async (newTodos) => {
    if (!isLoading.value) {
      await storage.save(newTodos)
      await updateStorageStats()
    }
  }, { deep: true })

  // 設置儲存變化監聽（Chrome擴展環境）
  storage.onStorageChanged((newValue, oldValue) => {
    if (newValue && newValue.todos && Array.isArray(newValue.todos)) {
      console.log('檢測到其他標籤頁的數據變化，正在同步...')
      todoItems.value = newValue.todos
    }
  })

  // 計算屬性
  const listSummary = computed(() => {
    const total = todoItems.value.length
    const done = todoItems.value.filter(item => item.done).length
    return `總共 ${total} 個項目，已完成 ${done} 個。`
  })

  // 動作
  function addTodo(newTodoLabel) {
    const newTodo = {
      id: 'todo-' + crypto.randomUUID(),
      label: newTodoLabel,
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    todoItems.value.push(newTodo)
  }

  function updateDoneStatus(todoId) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.done = !todo.done
      todo.updatedAt = new Date().toISOString()
    }
  }

  function deleteTodo(todoId) {
    todoItems.value = todoItems.value.filter(item => item.id !== todoId)
  }

  function editTodo(todoId, newLabel) {
    const todo = todoItems.value.find(item => item.id === todoId)
    if (todo) {
      todo.label = newLabel
      todo.updatedAt = new Date().toISOString()
    }
  }

  // 資料管理功能
  async function clearAllData() {
    todoItems.value = []
    await storage.clear()
    await updateStorageStats()
  }

  function resetToDefault() {
    todoItems.value = [...defaultTodos]
  }

  async function exportData() {
    return await storage.exportToFile()
  }

  async function importData(file) {
    try {
      const importedTodos = await storage.importFromFile(file)
      // 為匯入的數據添加缺失的時間戳
      const processedTodos = importedTodos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt || new Date().toISOString(),
        updatedAt: todo.updatedAt || new Date().toISOString()
      }))
      todoItems.value = processedTodos
      return true
    } catch (error) {
      console.error('匯入數據失敗:', error)
      throw error
    }
  }

  // 手動保存數據
  async function saveToStorage() {
    await storage.save(todoItems.value)
    await updateStorageStats()
  }

  // 手動載入數據
  async function loadFromStorage() {
    const loadedData = await storage.load()
    if (Array.isArray(loadedData)) {
      todoItems.value = loadedData
    } else {
      console.log('Invalid data loaded, keeping current todos')
    }
    await updateStorageStats()
  }

  // 同步到所有標籤頁
  async function syncToAllTabs() {
    await storage.syncToAllTabs()
  }

  // 初始化
  initializeData()

  return {
    todoItems,
    isLoading,
    storageStats,
    listSummary,
    addTodo,
    updateDoneStatus,
    deleteTodo,
    editTodo,
    clearAllData,
    resetToDefault,
    exportData,
    importData,
    saveToStorage,
    loadFromStorage,
    syncToAllTabs,
    updateStorageStats
  }
})
