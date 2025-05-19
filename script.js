let products = [];
let member = [];
let cart = [];
let inputValue = '';
let currentQuantity = 1;
let manualEntryMode = false;
let lastAddedProduct = null;
let currentSupervisor = null;
let cashInputValue = '';
let totalDeposit = 0;
let logonInputValue = '';
let transactionLogs = [];
let totalSales = 0;
let total = 0;

const inputDisplay = document.getElementById('input-display') || console.error('input-display not found');
const cartItems = document.getElementById('cart-items') || console.error('cart-items not found');
const cartTotal = document.getElementById('cart-total') || console.error('cart-total not found');
const totalDisplay = document.getElementById('total-display') || console.error('total-display not found');
const productsPanel = document.getElementById('products-panel') || console.error('products-panel not found');
const messageBox = document.getElementById('message-box') || console.error('message-box not found');
const paymentModal = document.getElementById('payment-modal') || console.error('payment-modal not found');
const receiptModal = document.getElementById('receipt-modal') || console.error('receipt-modal not found');
const paymentTotal = document.getElementById('payment-total') || console.error('payment-total not found');
const receiptItems = document.getElementById('receipt-items') || console.error('receipt-items not found');
const receiptTotal = document.getElementById('receipt-total') || console.error('receipt-total not found');
const errorMessage = document.getElementById('error-message') || console.error('error-message not found');
const receiptPaymentMethod = document.getElementById('receipt-payment-method') || console.error('receipt-payment-method not found');
const receiptDateTime = document.getElementById('receipt-datetime') || console.error('receipt-datetime not found');
const casherUser = document.getElementById('casher-user') || console.error('casher-user not found');
const cashPaymentModal = document.getElementById('cash-payment-modal');
const cashPaymentTotal = document.getElementById('cash-payment-total');
const cashDepositAmount = document.getElementById('cash-deposit-amount');
const cashChangeAmount = document.getElementById('cash-change-amount');
const cashChangeValue = document.getElementById('cash-change-value');
const cashInputDisplay = document.getElementById('cash-input-display');
const cancelCashBtn = document.getElementById('cancel-cash-btn');
const cashAmountBtn = document.getElementById('cash-amount-btn');
const cashSubtotalBtn = document.getElementById('cash-subtotal-btn');
const cashClearBtn = document.getElementById('cash-clear-btn');

document.addEventListener('DOMContentLoaded', async function () {
    await loadProductsFromJson();
    await loadMember();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadProducts();
    setupEventListeners();
    updateUserInfoDefault();
    showLogonModal();
});

async function loadProductsFromJson() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
    } catch (error) {
        console.error('products.jsonが読み取りできません', error);
        showMessage('商品データ情報が読めません');
        errorMessage.textContent = 'エラー:0002';
    }
}

async function loadMember() {
    try {
        const response = await fetch('member.json');
        member = await response.json();
        member = member.map(m => ({ ...m, id: String(m.id) }));
    } catch (error) {
        console.error('member.jsonが読み取りできません', error);
        showMessage('社員情報が読めません');
        errorMessage.textContent = 'エラー:0001';
    }
}

function setupEventListeners() {
    document.getElementById('btn-0').addEventListener('click', () => appendToInput('0'));
    document.getElementById('btn-1').addEventListener('click', () => appendToInput('1'));
    document.getElementById('btn-2').addEventListener('click', () => appendToInput('2'));
    document.getElementById('btn-3').addEventListener('click', () => appendToInput('3'));
    document.getElementById('btn-4').addEventListener('click', () => appendToInput('4'));
    document.getElementById('btn-5').addEventListener('click', () => appendToInput('5'));
    document.getElementById('btn-6').addEventListener('click', () => appendToInput('6'));
    document.getElementById('btn-7').addEventListener('click', () => appendToInput('7'));
    document.getElementById('btn-8').addEventListener('click', () => appendToInput('8'));
    document.getElementById('btn-9').addEventListener('click', () => appendToInput('9'));
    document.getElementById('btn-00').addEventListener('click', () => appendToInput('00'));
    document.getElementById('logon-btn-0').addEventListener('click', () => appendToLogonInput('0'));
    document.getElementById('logon-btn-1').addEventListener('click', () => appendToLogonInput('1'));
    document.getElementById('logon-btn-2').addEventListener('click', () => appendToLogonInput('2'));
    document.getElementById('logon-btn-3').addEventListener('click', () => appendToLogonInput('3'));
    document.getElementById('logon-btn-4').addEventListener('click', () => appendToLogonInput('4'));
    document.getElementById('logon-btn-5').addEventListener('click', () => appendToLogonInput('5'));
    document.getElementById('logon-btn-6').addEventListener('click', () => appendToLogonInput('6'));
    document.getElementById('logon-btn-7').addEventListener('click', () => appendToLogonInput('7'));
    document.getElementById('logon-btn-8').addEventListener('click', () => appendToLogonInput('8'));
    document.getElementById('logon-btn-9').addEventListener('click', () => appendToLogonInput('9'));
    document.getElementById('logon-btn-00').addEventListener('click', () => appendToLogonInput('00'));
    document.getElementById('logon-clear-btn').addEventListener('click', clearLogonInput);
    document.getElementById('logon-enter-btn').addEventListener('click', validateSupervisor);
    document.getElementById('clear-btn').addEventListener('click', clearInput);
    document.getElementById('quantity-btn').addEventListener('click', setQuantity);
    document.getElementById('search-btn').addEventListener('click', searchProduct);
    document.getElementById('enter-btn').addEventListener('click', enterProduct);
    document.getElementById('logoff-btn').addEventListener('click', logoff);
    document.getElementById('payment-btn').addEventListener('click', openPaymentModal);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    document.getElementById('remove-last-btn').addEventListener('click', removeLastItem);
    document.getElementById('discount-btn').addEventListener('click', addDiscount);
    document.getElementById('manual-entry-btn').addEventListener('click', switchToManualEntry);
    document.getElementById('close-receipt-btn').addEventListener('click', closeReceiptModal);
    document.getElementById('print-receipt-btn').addEventListener('click', printReceipt);
    document.getElementById('cancel-payment-btn').addEventListener('click', closePaymentModal);
    document.getElementById('cancel-touch-btn').addEventListener('click', () => {
        document.getElementById('touch-screen').style.display = 'none';
        document.getElementById('payment-methods').style.display = 'grid';
        document.getElementById('initial-options').style.display = 'block';
    });
    document.getElementById('payment-methods').addEventListener('click', (e) => {
        e.stopPropagation();
        const button = e.target.closest('.payment-method-btn');
        if (button) {
            const method = button.dataset.method;
            const total = cart.reduce((sum, item) => sum + item.amount, 0);
            if (method === 'Cash') {
                closePaymentModal();
                showCashPaymentModal(total);
            } else {
                showTouchScreen(method, total);
            }
        }
    });
    document.getElementById('touch-area').addEventListener('click', (e) => {
        const touchArea = document.getElementById('touch-area');
        const rect = touchArea.getBoundingClientRect();
        const x = e.clientX - rect.left - 25;
        const y = e.clientY - rect.top - 25;
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        touchArea.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        const method = document.getElementById('touch-method').textContent;
        completePayment(method);
    });
    document.querySelectorAll('#cash-payment-modal .keypad .btn').forEach(button => {
        if (button.id.startsWith('cash-btn-') && !['cash-amount-btn', 'cash-subtotal-btn', 'cash-clear-btn', 'cash-brank1', 'cash-brank2'].includes(button.id)) {
            button.addEventListener('click', () => appendToCashInput(button.textContent));
        }
    });
    if (cashAmountBtn) cashAmountBtn.addEventListener('click', processCashAmount);
    if (cashSubtotalBtn) cashSubtotalBtn.addEventListener('click', processCashSubtotal);
    if (cashClearBtn) cashClearBtn.addEventListener('click', clearCashInput);
    if (cancelCashBtn) cancelCashBtn.addEventListener('click', closeCashPaymentModal);
    document.addEventListener('keydown', handleKeydown);
}

function handleKeydown(event) {
    const key = event.key;
    console.log(key);
    if (document.getElementById('logon-modal').style.display === 'block') {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
            appendToLogonInput(key);
            event.preventDefault();
        } else if (key === "Enter") {
            validateSupervisor();
            event.preventDefault();
        } else if (key === ".") {
            clearLogonInput();
            event.preventDefault();
        }
    } else if (document.getElementById('cash-payment-modal').style.display === 'block') {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
            appendToCashInput(key);
            event.preventDefault();
        } else if (key === "Enter") {
            processCashSubtotal();
            event.preventDefault();
        } else if (key === ".") {
            clearCashInput();
            event.preventDefault();
        } else if (key === "Escape") {
            closeCashPaymentModal();
            event.preventDefault();
        } else if (key === "+") {
            processCashAmount();
            event.preventDefault();
        }
    } else {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
            appendToInput(key);
            event.preventDefault();
        } else if (key === "Enter") {
            if (inputValue) {
                enterProduct();
            } else if (lastAddedProduct) {
                addToCart(lastAddedProduct);
            }
            event.preventDefault();
        } else if (key === "*") {
            setQuantity();
            event.preventDefault();
        } else if (key === "Backspace") {
            removeLastItem();
            event.preventDefault();
        } else if (key === "Delete") {
            clearCart();
            event.preventDefault();
        } else if (key === "-") {
            addDiscount();
            event.preventDefault();
        } else if (key === "/") {
            searchProduct();
            event.preventDefault();
        } else if (key === "Escape") {
            closePaymentModal();
            event.preventDefault();
        } else if (key === " ") {
            switchToManualEntry();
            event.preventDefault();
        } else if (key === "Control") {
            openPaymentModal();
            event.preventDefault();
        } else if (key === ".") {
            clearInput();
            event.preventDefault();
        } else if (key === "ArrowRight") {
            logoff();
            event.preventDefault();
        }
    }
}

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('ja-JP');
    document.getElementById('datetime').textContent = dateTimeString;
}

function loadProducts() {
    productsPanel.innerHTML = '';
    products.forEach(product => {
        const productBtn = document.createElement('div');
        productBtn.className = 'product-btn';
        productBtn.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">¥${product.price}</div>
        `;
        productBtn.addEventListener('click', () => addToCart(product));
        productsPanel.appendChild(productBtn);
    });
}

function updateInputDisplay() {
    inputDisplay.textContent = inputValue;
}

function appendToInput(value) {
    inputValue += value;
    updateInputDisplay();
}

function clearInput() {
    inputValue = '';
    updateInputDisplay();
}

function setQuantity() {
    if (inputValue) {
        currentQuantity = parseInt(inputValue);
        showMessage(`数量: ${currentQuantity}`);
        clearInput();
    }
}

function searchProduct() {
    if (!inputValue) return;
    const product = products.find(p => p.id === inputValue);
    if (product) {
        showMessage(`${product.name}: ¥${product.price}`);
    } else {
        showMessage('商品が見つかりません');
    }
    clearInput();
}

function addProductByCode() {
    if (!inputValue) return;
    const product = products.find(p => p.id === inputValue);
    if (product) {
        addToCart(product);
        clearInput();
    } else {
        showMessage('商品が見つかりません');
        clearInput();
    }
}

function enterProduct() {
    if (manualEntryMode && inputValue) {
        const customPrice = parseInt(inputValue);
        const customProduct = {
            id: `custom-${Date.now()}`,
            name: '商品登録',
            price: customPrice
        };
        addToCart(customProduct);
        clearInput();
    } else {
        addProductByCode();
    }
}

function switchToManualEntry() {
    manualEntryMode = !manualEntryMode;
    if (manualEntryMode) {
        showMessage('金額入力モード');
    } else {
        showMessage('JAN入力モード');
    }
}

function addToCart(product) {
    if (!currentSupervisor) {
        showMessage('責任者ログインが必要です');
        showLogonModal();
        return;
    }
    const quantity = currentQuantity || 1;
    const amount = product.price * quantity;
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.amount += amount;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            amount: amount
        });
    }
    lastAddedProduct = product;
    updateCart();
    currentQuantity = 1;
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>¥${item.price}</td>
            <td>${item.quantity}</td>
            <td>¥${item.amount}</td>
        `;
        cartItems.appendChild(row);
        total += item.amount;
    });
    cartTotal.textContent = `¥${total}`;
    totalDisplay.textContent = `¥${total}`;
}

function clearCart() {
    cart = [];
    lastAddedProduct = null;
    updateCart();
}

function removeLastItem() {
    if (cart.length > 0) {
        cart.pop();
        updateCart();
    }
}

function addDiscount() {
    if (inputValue) {
        const discountAmount = parseInt(inputValue);
        const discountItem = {
            id: 'discount',
            name: '割引',
            price: -discountAmount,
            quantity: 1,
            amount: -discountAmount
        };
        cart.push(discountItem);
        updateCart();
        clearInput();
    } else {
        showMessage('割引額を入力してください');
    }
}

function showMessage(message) {
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

function openPaymentModal() {
    if (!currentSupervisor) {
        showMessage('責任者ログインが必要です');
        showLogonModal();
        return;
    }
    if (cart.length === 0) {
        showMessage('商品がありません');
        return;
    }
    let total = 0;
    cart.forEach(item => {
        total += item.amount;
    });
    paymentTotal.textContent = `¥${total}`;
    paymentModal.style.display = 'block';
    document.getElementById('payment-methods').style.display = 'grid';
    document.getElementById('initial-options').style.display = 'block';
    document.getElementById('touch-screen').style.display = 'none';
}

function closePaymentModal() {
    paymentModal.style.display = 'none';
}

function processPayment(method) {
    let total = 0;
    cart.forEach(item => {
        total += item.amount;
    });
    if (cart.length === 0) {
        showMessage('カートが空です');
        return;
    }
    receiptDateTime.textContent = new Date().toLocaleString('ja-JP');
    casherUser.textContent = '責:' + currentSupervisor.id + currentSupervisor.name;
    receiptItems.innerHTML = '';
    cart.forEach(item => {
        const itemLine = document.createElement('p');
        itemLine.innerHTML = `${item.name} x ${item.quantity} <span style="float: right;">¥${item.amount}</span>`;
        receiptItems.appendChild(itemLine);
    });
    receiptTotal.textContent = `¥${total}`;
    receiptPaymentMethod.textContent = method;
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = '';
    const postpaidMethods = ['QUICPay', 'iD', 'PiTaPa'];
    const paymentInfo = document.createElement('p');
    if (method === 'Credit') {
        const cardBrands = ['Visa', 'Mastercard', 'JCB', 'Amex'];
        const randomBrand = cardBrands[Math.floor(Math.random() * cardBrands.length)];
        const cardLast4 = Math.floor(1000 + Math.random() * 9000).toString();
        const approvalCode = Math.floor(100000 + Math.random() * 900000).toString();
        paymentInfo.innerHTML = `
            カード: ${randomBrand} ****-****-****-${cardLast4}<br>
            承認番号: ${approvalCode}<br>
            取引: 一括払い
        `;
    } else if (method === 'Cash') {
        paymentInfo.innerHTML = `
            預かり金額: ¥${window.cashReceived || 0}<br>
            お釣り: ¥${window.cashChange || 0}
        `;
    } else if (postpaidMethods.includes(method)) {
        const approvalCode = Math.floor(100000 + Math.random() * 900000).toString();
        paymentInfo.innerHTML = `承認番号: ${approvalCode}`;
    } else {
        const transactionId = `${method.slice(0, 2).toUpperCase()}${Math.floor(100000000 + Math.random() * 900000000)}`;
        const balance = Math.floor(5000 + Math.random() * 15000);
        paymentInfo.innerHTML = `
            トランザクションID: ${transactionId}<br>
            残高: ¥${balance}
        `;
    }
    paymentDetails.appendChild(paymentInfo);
    closePaymentModal();
    receiptModal.style.display = 'block';
    clearCart();
}

function closeReceiptModal() {
    receiptModal.style.display = 'none';
}

function printReceipt() {
    const receiptContent = document.getElementById('receipt-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>レシート印刷</title>
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    width: 300px;
                    margin: 0 auto;
                }
            </style>
        </head>
        <body>
            ${receiptContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function showTouchScreen(method, total) {
    document.getElementById('payment-methods').style.display = 'none';
    document.getElementById('initial-options').style.display = 'none';
    document.getElementById('touch-screen').style.display = 'block';
    document.getElementById('touch-method').textContent = method;
    document.getElementById('touch-amount').textContent = `¥${total}`;
}

function completePayment(method) {
    const soundMap = {
        'Credit': 'sound/credit.mp3',
        'QUICPay': 'sound/quicpay.mp3',
        'iD': 'sound/iD.wav',
        'IC': 'sound/transportationic.mp3',
        'WAON': 'sound/waon.mp3',
        'PiTaPa': 'sound/pitapa.mp3'
    };
    const soundFile = soundMap[method];
    const audio = new Audio(soundFile);
    audio.play().catch(() => console.log(`Sound playback failed: ${soundFile}`));
    processPayment(method);
}

function showLogonModal() {
    if (!currentSupervisor) {
        document.getElementById('logon-modal').style.display = 'block';
        clearLogonInput();
    }
}

function appendToLogonInput(value) {
    logonInputValue += value;
    updateLogonInputDisplay();
}

function clearLogonInput() {
    logonInputValue = '';
    updateLogonInputDisplay();
}

function updateLogonInputDisplay() {
    document.getElementById('logon-input-display').textContent = logonInputValue;
}

function validateSupervisor() {
    const supervisor = member.find(m => m.id === logonInputValue);
    if (supervisor) {
        currentSupervisor = supervisor;
        document.getElementById('logon-modal').style.display = 'none';
        updateUserInfo();
        showMessage(`ようこそ、${supervisor.name}さん`);
        clearLogonInput();
    } else {
        showMessage('責任者番号が無効です');
        clearLogonInput();
    }
}

function updateUserInfo() {
    const userInfo = document.querySelector('.user-info');
    userInfo.textContent = `責番: ${currentSupervisor.id} ${currentSupervisor.name}`;
}

function logoff() {
    if (cart.length > 0) {
        showMessage('カートに商品があるためログオフできません');
        return;
    }
    currentSupervisor = null;
    showLogonModal();
    updateUserInfoDefault();
    showMessage('ログオフしました');
}

function updateUserInfoDefault() {
    const userInfo = document.querySelector('.user-info');
    userInfo.textContent = '';
}

function showCashPaymentModal(total) {
    if (!cashPaymentModal) {
        console.error('cash-payment-modal not found in DOM');
        showMessage('現金支払いモーダルが利用できません');
        return;
    }
    cashPaymentTotal.textContent = `¥${total}`;
    cashDepositAmount.textContent = '¥0';
    cashChangeAmount.style.display = 'none';
    cashInputDisplay.textContent = '0';
    cashInputValue = '';
    totalDeposit = 0;
    cashPaymentModal.style.display = 'block';
    cashInputDisplay.focus();
}

function closeCashPaymentModal() {
    cashPaymentModal.style.display = 'none';
}

function appendToCashInput(value) {
    cashInputValue += value;
    updateCashInputDisplay();
}

function updateCashInputDisplay() {
    cashInputDisplay.textContent = cashInputValue || '0';
}

function clearCashInput() {
    cashInputValue = '';
    updateCashInputDisplay();
}

function processCashAmount() {
    if (cashInputValue) {
        const amount = parseInt(cashInputValue, 10);
        totalDeposit += amount;
        cashDepositAmount.textContent = `¥${totalDeposit}`;
        clearCashInput();
    }
}

function processCashSubtotal() {
    const total = parseInt(cashPaymentTotal.textContent.replace('¥', ''), 10);
    if (!totalDeposit || totalDeposit < total) {
        alert('預かり金額が不足しています。');
        clearCashInput();
        return;
    }
    window.cashReceived = totalDeposit;
    window.cashChange = totalDeposit - total;
    cashChangeAmount.style.display = 'block';
    cashChangeValue.textContent = `¥${window.cashChange}`;
    processPayment('Cash');
}