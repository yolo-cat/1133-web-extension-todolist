// content.js
// 監聽使用者選取文字，並發送訊息到擴充

console.log('TodoList Extension: Content script loaded on:', window.location.href);

// 檢查是否在問題網站上，如果是則限制功能
const isProblematicSite = () => {
  const hostname = window.location.hostname.toLowerCase();
  const problematicSites = [
    'moodle',
    'blackboard',
    'canvas',
    'classroom.google.com',
    'teams.microsoft.com',
    'zoom.us'
  ];

  return problematicSites.some(site => hostname.includes(site));
};

// 檢查Chrome擴展API是否可用
if (!chrome || !chrome.runtime) {
  console.error('TodoList Extension: Chrome runtime not available');
} else {
  console.log('TodoList Extension: Chrome runtime available');
}

// 防止與其他腳本衝突的安全包裝器
const safeExecute = (fn) => {
  try {
    return fn();
  } catch (error) {
    console.error('TodoList Extension: Safe execution failed:', error);
    return null;
  }
};

// 添加防抖機制，避免過於頻繁的事件觸發
let selectionTimeout;
const SELECTION_DELAY = 500; // 500ms 延遲

document.addEventListener('mouseup', (event) => {
  // 清除之前的 timeout
  if (selectionTimeout) {
    clearTimeout(selectionTimeout);
  }

  // 延遲執行選取處理
  selectionTimeout = setTimeout(() => {
    safeExecute(() => {
      const selectedText = window.getSelection().toString().trim();

      if (selectedText && selectedText.length > 0) {
        console.log('TodoList Extension: Selected text:', selectedText);

        // 在問題網站上顯示較溫和的提示
        if (isProblematicSite()) {
          console.log('TodoList Extension: Running on educational platform, using safe mode');
          showNotification(`選取文字: ${selectedText.substring(0, 20)}...（點擊擴展圖標手動添加）`, 'info');
          return;
        }

        // 立即顯示通知，不等待擴展回應
        showNotification(`正在添加到待辦清單: ${selectedText.substring(0, 30)}${selectedText.length > 30 ? '...' : ''}`);

        try {
          if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(
              { action: 'addTodo', text: selectedText },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error('TodoList Extension: Error sending message:', chrome.runtime.lastError.message);
                  showNotification('❌ 添加失敗：' + chrome.runtime.lastError.message, 'error');
                } else if (response && response.success) {
                  console.log('TodoList Extension: Message sent successfully');
                  showNotification(`✅ 已添加到待辦清單: ${selectedText.substring(0, 30)}${selectedText.length > 30 ? '...' : ''}`, 'success');
                } else {
                  console.error('TodoList Extension: Failed response:', response);
                  showNotification('❌ 添加失敗：無效回應', 'error');
                }
              }
            );
          } else {
            console.error('TodoList Extension: Chrome runtime sendMessage not available');
            showNotification('❌ Chrome擴展API不可用', 'error');
          }
        } catch (error) {
          console.error('TodoList Extension: Exception when sending message:', error);
          showNotification('❌ 發送訊息時出錯', 'error');
        }
      }
    });
  }, SELECTION_DELAY);
});

// 顯示視覺反饋通知
function showNotification(message, type = 'info') {
  safeExecute(() => {
    // 移除現有的通知（如果有的話）
    const existingNotification = document.getElementById('todolist-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // 根據類型設置顏色
    let backgroundColor = '#409EFF'; // 預設藍色
    if (type === 'success') backgroundColor = '#67C23A'; // 綠色
    if (type === 'error') backgroundColor = '#F56C6C'; // 紅色

    // 創建新的通知
    const notification = document.createElement('div');
    notification.id = 'todolist-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      z-index: 999999;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      max-width: 350px;
      word-wrap: break-word;
      animation: slideIn 0.3s ease-out;
      pointer-events: auto;
      cursor: pointer;
    `;

    // 添加動畫樣式（只在沒有的時候添加）
    if (!document.head.querySelector('#todolist-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'todolist-animation-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    notification.textContent = message;

    // 點擊通知可關閉
    notification.addEventListener('click', () => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    });

    document.body.appendChild(notification);

    // 根據類型設置不同的顯示時間
    const displayTime = type === 'error' ? 5000 : 3000;

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, displayTime);
  });
}

// 監聽來自popup的訊息
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('TodoList Extension: Content script received message:', message);
    if (message.action === 'todoAdded') {
      console.log('TodoList Extension: Todo successfully added to list');
      showNotification('✅ 待辦事項已成功新增！', 'success');
      sendResponse({ received: true });
    }
    return true;
  });
}

// 檢測擴展是否正確載入
setTimeout(() => {
  console.log('TodoList Extension: Content script initialization complete');

  // 在問題網站上提供額外的提示
  if (isProblematicSite()) {
    console.log('TodoList Extension: Educational platform detected, running in safe mode');
  }
}, 1000);
