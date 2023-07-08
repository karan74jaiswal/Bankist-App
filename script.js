'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 12500],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2023-07-04T10:51:36.790Z',
    '2023-07-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-EN',
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

// Getting the currency in correct fromat
const currencyFormat = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

// Calculating Number of days passed
const numberOfDaysPassed = date =>
  Math.trunc((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));

// Calculate and Display Balance
let currentAccountBalance;
const displayBalance = function ({ movements, locale, currency }) {
  currentAccountBalance = movements.reduce(
    (balance, movement) => balance + movement,
    0
  );

  // Updating and Formatting Balance and Date and time
  labelBalance.textContent = currencyFormat(
    currentAccountBalance,
    locale,
    currency
  );

  // Updating and Formatting Date and time
  labelDate.textContent = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
};

// Calculate and Display Summary
const displaySummary = function ({
  movements,
  interestRate,
  locale,
  currency,
}) {
  const totalDeposit = movements
    .filter(movement => movement > 0)
    .reduce((sum, deposit) => sum + deposit, 0);

  const totalWithdrew = movements
    .filter(movement => movement < 0)
    .reduce((sum, withdrawal) => sum + withdrawal, 0);

  const totalInterest = movements
    .filter(movement => movement > 0)
    .reduce((sum, deposit) => sum + interestRate * 0.01 * deposit, 0);

  // Displaying Total Deposit in correct Format
  labelSumIn.textContent = currencyFormat(totalDeposit, locale, currency);

  // Displaying Total Withdrawal in correct Format
  labelSumOut.textContent = currencyFormat(
    Math.abs(totalWithdrew),
    locale,
    currency
  );

  // Displaying Total Interest in correct Format
  labelSumInterest.textContent = currencyFormat(
    totalInterest,
    locale,
    currency
  );
};

// Display Movements
const displayMovements = function (
  { movements, locale, currency, movementsDates },
  sort = false
) {
  containerMovements.innerHTML = '';
  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((movement, index) => {
    let movementDate =
      numberOfDaysPassed(movementsDates[index]) < 1
        ? 'Today'
        : numberOfDaysPassed(movementsDates[index]) == 1
        ? 'Yesterday'
        : numberOfDaysPassed(movementsDates[index]) > 1 &&
          numberOfDaysPassed(movementsDates[index]) <= 7
        ? numberOfDaysPassed(movementsDates[index]) + ' days ago'
        : new Intl.DateTimeFormat('locale', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(new Date(movementsDates[index]));
    let type = movement > 0 ? 'deposit' : 'withdrawal';
    let str = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${movementDate}</div>
  <div class="movements__value">${currencyFormat(
    movement,
    locale,
    currency
  )}</div>
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
    currentAccount.movementsDates.push(new Date().toISOString());
    transferAccount.movements.push(transferAmount);
    transferAccount.movementsDates.push(new Date().toISOString());
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
    currentAccount.movementsDates.push(new Date().toISOString());
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
