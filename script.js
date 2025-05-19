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
let totalSales = 0;
let total = 0;
let transactionLogs = loadTransactions();

const settlementBtn = document.getElementById('settlement-btn');
const settlementModal = document.getElementById('settlement-modal');
const settlementTotal = document.getElementById('settlement-total');
const settlementDeposit = document.getElementById('settlement-deposit');
const settlementConfirmModal = document.getElementById('settlement-confirm-modal');
const settlementConfirmTotal = document.getElementById('settlement-confirm-total');
const settlementConfirmDeposit = document.getElementById('settlement-confirm-deposit');
const settlementExecuteBtn = document.getElementById('settlement-execute-btn');
const settlementConfirmCancelBtn = document.getElementById('settlement-confirm-cancel-btn');
const settlementCancelBtn = document.getElementById('settlement-cancel-btn');
const inputDisplay = document.getElementById('input-display') || console.error('input-display not found');
const cartItems = document.getElementById('cart-items') || console.error('cart-items not found');
const cartTotal = document.getElementById('cart-total') || console.error('cart-total not found');
const itemTotal = document.getElementById('item-total') || console.error('item-total not found');
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
const settlementConfirmBtn = document.getElementById('settlement-confirm-btn');
const logBtn = document.getElementById('log-btn');
const logCloseBtn = document.getElementById('log-close-btn');

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
    document.getElementById('discount-half-btn').addEventListener('click', addDiscounthalf);
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
    if (settlementBtn) settlementBtn.addEventListener('click', openSettlementModal);
    if (settlementCancelBtn) settlementCancelBtn.addEventListener('click', closeSettlementModal);
    if (settlementConfirmCancelBtn) settlementConfirmCancelBtn.addEventListener('click', closeSettlementConfirmModal);
    if (settlementExecuteBtn) settlementExecuteBtn.addEventListener('click', downloadTransactionLogs);
    if (settlementConfirmBtn) settlementConfirmBtn.addEventListener('click', openSettlementConfirmModal);
    if (logBtn) logBtn.addEventListener('click', openLogModal);
    if (logCloseBtn) logCloseBtn.addEventListener('click', closeLogModal);
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

    if (product.id === 'discount') {
        addDiscounthalf();
        return;
    }

    const quantity = currentQuantity || 1;
    
    for (let i = cart.length - 1; i >= 0; i--) {
        const item = cart[i];
        if (item.id === product.id && item.discount === 0) {
            item.quantity += quantity;
            item.amount = item.price * item.quantity;
            saveTransaction('商品追加 (数量変更)', { product: product.name, quantity: quantity, newQuantity: item.quantity });
            lastAddedProduct = product;
            updateCart();
            currentQuantity = 1;
            return;
        }
    }
    
    const amount = product.price * quantity;
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        amount: amount,
        discount: 0
    });
    
    saveTransaction('商品追加', { product: product.name, quantity: quantity });
    lastAddedProduct = product;
    updateCart();
    currentQuantity = 1;
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const discountDisplay = item.discount !== 0 && item.discount !== undefined ? `¥${item.discount}` : '-';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>¥${item.price}</td>
            <td>${item.quantity}</td>
            <td>${discountDisplay}</td>
            <td>¥${item.amount}</td>
        `;
        cartItems.appendChild(row);
        total += item.amount;
    });
    cartTotal.textContent = `¥${total}`;
    totalDisplay.textContent = `¥${total}`;
}

function clearCart() {
    if (cart.length > 0) {
        saveTransaction('カートクリア', { itemCount: cart.length });
        cart = [];
        lastAddedProduct = null;
        updateCart();
    }
}

function removeLastItem() {
    if (cart.length > 0) {
        const removedItem = cart.pop();
        saveTransaction('直前の商品取消', { product: removedItem.name, quantity: removedItem.quantity });
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
        saveTransaction('割引適用', { amount: discountAmount });
        updateCart();
        clearInput();
    } else {
        showMessage('割引額を入力してください');
    }
}
function addDiscounthalf() {
    if (!currentSupervisor) {
        showMessage('責任者ログインが必要です');
        showLogonModal();
        return;
    }

    if (cart.length === 0) {
        showMessage('カートに商品がありません');
        return;
    }

    const lastItem = cart[cart.length - 1];
    if (lastItem.id === 'discount') {
        showMessage('直前の商品は割引です');
        return;
    }
    if (lastItem.discount !== 0) {
        showMessage('この商品はすでに割引されています');
        return;
    }

    if (lastItem.quantity > 1) {
        const discountItem = {
            id: lastItem.id,
            name: lastItem.name,
            price: lastItem.price,
            quantity: 1,
            amount: lastItem.price,
            discount: 0
        };
        
        lastItem.quantity -= 1;
        lastItem.amount = lastItem.price * lastItem.quantity;
        
        cart.push(discountItem);
        
        const newLastItem = cart[cart.length - 1];
        const discountAmount = Math.floor(newLastItem.amount / 2);
        newLastItem.discount = -discountAmount;
        newLastItem.amount -= discountAmount;
    } else {
        const discountAmount = Math.floor(lastItem.amount / 2);
        lastItem.discount = -discountAmount;
        lastItem.amount -= discountAmount;
    }

    saveTransaction('半額割引', {
        product: lastItem.name,
        originalAmount: lastItem.price,
        discountAmount: Math.floor(lastItem.price / 2)
    });

    updateCart();
    clearInput();
    showMessage('半額割引を適用しました');
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
    const purchasedItems = cart.map(item => ({ name: item.name, quantity: item.quantity, amount: item.amount }));
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
    let paymentDescription = '';
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
        paymentDescription = `クレジット払い (ブランド: ${randomBrand}, 下4桁: ${cardLast4}, 承認番号: ${approvalCode})`;
    } else if (method === 'Cash') {
        paymentInfo.innerHTML = `
            預かり金額: ¥${window.cashReceived || 0}<br>
            お釣り: ¥${window.cashChange || 0}
        `;
        paymentDescription = `現金払い (預かり: ¥${window.cashReceived || 0}, お釣り: ¥${window.cashChange || 0})`;
    } else if (postpaidMethods.includes(method)) {
        const approvalCode = Math.floor(100000 + Math.random() * 900000).toString();
        paymentInfo.innerHTML = `承認番号: ${approvalCode}`;
        paymentDescription = `${method}払い (承認番号: ${approvalCode})`;
    } else {
        const transactionId = `${method.slice(0, 2).toUpperCase()}${Math.floor(100000000 + Math.random() * 900000000)}`;
        const balance = Math.floor(5000 + Math.random() * 15000);
        paymentInfo.innerHTML = `
            トランザクションID: ${transactionId}<br>
            残高: ¥${balance}
        `;
        paymentDescription = `${method}払い (ID: ${transactionId}, 残高: ¥${balance})`;
    }
    paymentDetails.appendChild(paymentInfo);
    closePaymentModal();
    receiptModal.style.display = 'block';
    saveTransaction('会計', { method: method, total: total, items: purchasedItems, paymentDetails: paymentDescription });
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
        saveTransaction('ログオン', { supervisor: { id: supervisor.id, name: supervisor.name } });
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
    if (currentSupervisor) {
        saveTransaction('ログオフ', { supervisor: { id: currentSupervisor.id, name: currentSupervisor.name } });
        currentSupervisor = null;
        showLogonModal();
        updateUserInfoDefault();
        showMessage('ログオフしました');
    }
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

function saveTransaction(type, details) {
    const timestamp = formatJST(new Date());
    const logEntry = { timestamp, type, details, supervisor: currentSupervisor ? { id: currentSupervisor.id, name: currentSupervisor.name } : null };
    transactionLogs.push(logEntry);
    localStorage.setItem('transactionLogs', JSON.stringify(transactionLogs));
}

function loadTransactions() {
    const storedLogs = localStorage.getItem('transactionLogs');
    return storedLogs ? JSON.parse(storedLogs) : [];
}

function openSettlementModal() {
    if (!currentSupervisor) {
        showMessage('責任者ログインが必要です');
        showLogonModal();
        return;
    }
    if (cart.length > 0) {
        showMessage('カートに商品があるためログオフできません');
        return;
    }
    const totalAmount = transactionLogs.reduce((sum, log) => {
        if (log.type === '会計') {
            return sum + log.details.total;
        }
        return sum;
    }, 0);
    settlementTotal.textContent = `¥${totalAmount}`;
    settlementDeposit.textContent = '¥0';
    settlementModal.style.display = 'block';
}

function closeSettlementModal() {
    settlementModal.style.display = 'none';
}

function openSettlementConfirmModal() {
    console.log('Open settlement confirm modal');
    const totalAmount = transactionLogs.reduce((sum, log) => {
        if (log.type === '会計') {
            return sum + log.details.total;
        }
        return sum;
    }, 0);
    settlementConfirmTotal.textContent = `¥${totalAmount}`;
    settlementConfirmDeposit.textContent = '¥0';
    settlementConfirmModal.style.display = 'block';
    settlementModal.style.display = 'none';
}

function closeSettlementConfirmModal() {
    settlementConfirmModal.style.display = 'none';
    settlementModal.style.display = 'block';
}

function formatJST(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function downloadTransactionLogs() {
    console.log('Starting downloadTransactionLogs');

    const now = new Date();
    const settlementTimestamp = formatJST(now);

    const supervisor = currentSupervisor ? {
        id: currentSupervisor.id,
        name: currentSupervisor.name
    } : null;

    const fromTimestamp = transactionLogs.length > 0 ? formatJST(new Date(transactionLogs[0].timestamp)) : settlementTimestamp;
    const toTimestamp = transactionLogs.length > 0 ? formatJST(new Date(transactionLogs[transactionLogs.length - 1].timestamp)) : settlementTimestamp;

    const totalSales = transactionLogs.reduce((sum, log) => {
        if (log.type === '会計') {
            return sum + log.details.total;
        }
        return sum;
    }, 0);

    const settlementData = {
        settlementTimestamp,
        supervisor,
        period: {
            fromTimestamp,
            toTimestamp
        },
        totalSales,
        transactions: transactionLogs
    };

    const jsonLogs = JSON.stringify(settlementData, null, 2);
    console.log('Settlement data:', jsonLogs);

    const filename = `settlement_${settlementTimestamp.replace(/:/g, '-').replace(' ', '_')}.json`;

    const blob = new Blob([jsonLogs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    console.log('Triggering download');
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Download completed');

    transactionLogs = [];
    localStorage.removeItem('transactionLogs');
    closeSettlementConfirmModal();
    closeSettlementModal();
    logoff();
}

function formatLogDetails(log) {
    switch (log.type) {
        case '会計':
            const itemCount = log.details.items ? log.details.items.length : 0;
            return `${log.details.method}, ¥${log.details.total}, ${itemCount}点`;
        case '商品追加':
            return `${log.details.product}, 数量: ${log.details.quantity}`;
        case '商品追加 (数量変更)':
            return `${log.details.product}, 数量: ${log.details.newQuantity}`;
        case '割引適用':
            return `割引: ¥${log.details.amount}`;
        case '半額割引':
            return `${log.details.product}, ¥${log.details.discountAmount}`;
        case 'カートクリア':
            return `商品${log.details.itemCount}点削除`;
        case '直前の商品取消':
            return `${log.details.product}, 数量: ${log.details.quantity}`;
        case 'ログオン':
        case 'ログオフ':
            return '-';
        default:
            return '詳細なし';
    }
}

function openLogModal() {
    if (!currentSupervisor) {
        showMessage('責任者ログインが必要です');
        showLogonModal();
        return;
    }

    const logItems = document.getElementById('log-items');
    logItems.innerHTML = '';

    if (transactionLogs.length === 0) {
        logItems.innerHTML = '<tr><td colspan="4">ログがありません</td></tr>';
    } else {
        transactionLogs.slice().reverse().forEach(log => {
            const row = document.createElement('tr');
            const details = formatLogDetails(log);
            const supervisor = log.supervisor ? `${log.supervisor.id} ${log.supervisor.name}` : 'なし';
            row.innerHTML = `
                <td>${log.timestamp}</td>
                <td>${log.type}</td>
                <td>${details}</td>
                <td>${supervisor}</td>
            `;
            logItems.appendChild(row);
        });
    }

    document.getElementById('log-modal').style.display = 'block';
}

function closeLogModal() {
    document.getElementById('log-modal').style.display = 'none';
}