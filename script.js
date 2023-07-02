'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Creating Usernames
accounts.forEach(
  account =>
    (account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join(''))
);

// Functionalities

// Calculate and Display Balance
let currentAccountBalance;
const displayBalance = function ({ movements }) {
  currentAccountBalance = movements.reduce(
    (balance, movement) => balance + movement,
    0
  );
  labelBalance.textContent = `${currentAccountBalance}€`;
};

// Calculate and Display Summary
const displaySummary = function ({ movements, interestRate }) {
  const totalDeposit = movements
    .filter(movement => movement > 0)
    .reduce((sum, deposit) => sum + deposit, 0);

  const totalWithdrew = movements
    .filter(movement => movement < 0)
    .reduce((sum, withdrawal) => sum + withdrawal, 0);

  const totalInterest = movements
    .filter(movement => movement > 0)
    .reduce((sum, deposit) => sum + interestRate * 0.01 * deposit, 0);

  labelSumIn.textContent = `${totalDeposit}€`;
  labelSumOut.textContent = `${Math.abs(totalWithdrew)}€`;
  labelSumInterest.textContent = `${String(totalInterest).slice(0, 5)}€`;
};

// Display Movements
const displayMovements = function ({ movements }, sort = false) {
  containerMovements.innerHTML = '';
  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((movement, index) => {
    let type = movement > 0 ? 'deposit' : 'withdrawal';
    let str = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
  <div class="movements__value">${movement}€</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', str);
  });
};

// Updating UI
const updateUI = function (currentAccount) {
  displayBalance(currentAccount);
  displaySummary(currentAccount);
  displayMovements(currentAccount);
};

// Callback Functions

// Login Feature
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const usernameInput = inputLoginUsername.value;
  const pinInput = Number(inputLoginPin.value);
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  currentAccount = accounts.find(
    ({ username, pin }) => usernameInput === username && pinInput === pin
  );

  if (currentAccount) {
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner
      .split(' ')
      .slice(0, 1)}`;
    containerApp.style.opacity = 1;
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = 'Wrong Credentials, Try Again';
  }
});

// Money Transfer Feature
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferUsername = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  const transferAccount = accounts.find(
    ({ username }) => transferUsername === username
  );
  if (
    transferAccount &&
    transferAmount <= currentAccountBalance &&
    transferAmount > 0
  ) {
    currentAccount.movements.push(-transferAmount);
    transferAccount.movements.push(transferAmount);
    updateUI(currentAccount);
  }
});

// Loan Request Feature
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(movement => movement > 0.1 * loanAmount)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  }
});

// Account Closure Feature
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const inputUsername = inputCloseUsername.value;
  const inputPin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  if (
    inputUsername &&
    inputPin &&
    inputUsername === currentAccount.username &&
    inputPin === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(
        ({ username }) => username === currentAccount.username
      ),
      1
    );
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});

// Sorting Feature
let sort = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;
});
