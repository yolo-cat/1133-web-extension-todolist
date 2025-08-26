// content.js
// 監聽使用者選取文字，並發送訊息到擴充

console.log('TodoList Extension: Content script loaded');

document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    console.log('TodoList Extension: Selected text:', selectedText);
    try {
      chrome.runtime.sendMessage({ action: 'addTodo', text: selectedText }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('TodoList Extension: Error sending message:', chrome.runtime.lastError);
        } else {
          console.log('TodoList Extension: Message sent successfully');
        }
      });
    } catch (error) {
      console.error('TodoList Extension: Exception when sending message:', error);
    }
  }
});

// 添加視覺反饋 - 當選取文字時顯示提示
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    // 創建一個臨時提示
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #409EFF;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    notification.textContent = `已添加到待辦清單: ${selectedText.substring(0, 30)}${selectedText.length > 30 ? '...' : ''}`;

    document.body.appendChild(notification);

    // 3秒後移除提示
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
});
