"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: "James Smith",
  movements: [
    200000, 455000, -306000, 25000000, -642000, -133000, 79000, 1300000,
  ],
  interestRate: 0.18, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "fa-IR", // de-DE
};

const account2 = {
  owner: "Bahram Nouraei",
  movements: [
    5000000, 3400000, -150000, -790000, -3210000, -1000000, 8500000, -30000,
  ],
  interestRate: 0.2,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "fa-IR",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

// my element
const labelSumInterestName = document.querySelector(
  ".summary__label--interest"
);

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const accountsTable = document.querySelector("table");
const accountsTbody = document.querySelector(".table-tbody-accounts");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

///////////////////my codes/////////////

// make currencies to rial
const numberToRial = function (number) {
  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
  }).format(number);
};

// display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ``;

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // change sort btn text by click
  sort
    ? (btnSort.textContent = "ترتیب (مبلغ)")
    : (btnSort.textContent = "ترتیب (تاریخ)");

  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const finalDate =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
        ? `امروز`
        : new Intl.DateTimeFormat("fa-IR").format(date);

    const html = `
     <div class="movements__row">
        <div class="movements__type ${
          mov > 0 ? `movements__type--deposit` : `movements__type--withdrawal`
        }">
           ${i + 1} - ${mov > 0 ? `واریز` : `برداشت`}
        </div>
<div class="movements__date">${finalDate}</div>
        <div class="movements__value" lang="en" dir="ltr" >${numberToRial(
          mov
        )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// display balances
// function for balancing
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((total, num) => total + num);
  labelBalance.textContent = numberToRial(account.balance);
};

// create username
const createUserName = function (accs, i) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((value) => value.at(0))
      .join("");
  });
};
createUserName(accounts);

// fill accountsTable
accountsTbody.innerHTML = ``;
accounts.forEach((acc) => {
  const html = `<tr>
  <td align="left">${acc.owner}</td>
  <td align="left">${acc.username}</td>
  <td align="left">${acc.pin}</td>
</tr>`;
  accountsTbody.insertAdjacentHTML("beforeend", html);
});

//calculate deposits, withdrawals and bank interest
const calcDisplayStatistic = function (account) {
  const deposits = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = numberToRial(Math.floor(deposits));

  const withdrawals = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = numberToRial(Math.abs(Math.floor(withdrawals)));

  const interest =
    account.movements.reduce((acc, cur) => acc + cur, 0) * account.interestRate;
  labelSumInterest.textContent = numberToRial(Math.floor(interest));
};

// clear and unfocus function
const clearUnfocus = function () {
  inputLoginPin.blur();
  inputLoginUsername.blur();
  inputLoginUsername.value = inputLoginPin.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
  inputTransferAmount.value = inputTransferTo.value = "";
  inputCloseUsername.blur();
  inputClosePin.blur();
  inputCloseUsername.value = inputClosePin.value = "";
  inputLoanAmount.blur();
  inputLoanAmount.value = "";
};

/////////

// event handler
let currentAccount;

// // faek logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// update UI funciton
function updateUI(acc) {
  // display movements
  displayMovements(acc);
  // display statistic
  calcDisplayStatistic(acc);
  // display balance
  calcDisplayBalance(acc);
}

// count down date initialization
let countDownDate;

//////////////////////
//////implement logging in

btnLogin.addEventListener("click", function (e) {
  // prevent form from submitting
  e.preventDefault();

  if (
    accounts.some((account) => account.username === inputLoginUsername.value)
  ) {
    currentAccount = accounts.find(
      (account) => account.username === inputLoginUsername.value
    );
  }

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // hide accounts table
    accountsTable.style.opacity = 0;

    // implement countdown
    // Set the date we're counting down to
    countDownDate = new Date().getTime() + 5 * 60 * 1000 + 1000;

    // Update the count down every 1 second
    const countDownFn = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for minutes and seconds

      const minutes = `${Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      )}`.padStart(2, 0);
      const seconds = `${Math.floor((distance % (1000 * 60)) / 1000)}`.padStart(
        2,
        0
      );

      // Output the result in an element with id="demo"
      labelTimer.innerHTML = minutes + ":" + seconds;

      // If the count down is over, write some text
      if (distance < 1000) {
        clearInterval(countDownFn);
        containerApp.style.opacity = 0;
        containerApp.style.transform = "scale(0)";
        labelWelcome.textContent = "نام کاربری و رمز خود را وارد کنید";
        clearUnfocus();
        accountsTable.style.opacity = 100;
      }
    }, 1000);

    // clear and unfocus
    clearUnfocus();

    // set balance time
    const now = new Date();
    const balanceTimeObject = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      balanceTimeObject
    ).format(now);

    // display app and welcome message
    containerApp.style.opacity = 100;
    containerApp.style.transform = "scale(1)";
    labelWelcome.textContent = `${currentAccount.owner
      .split(" ")
      .at(0)} عزیز، خوش آمدید`;

    // update UI
    updateUI(currentAccount);

    // labelSumInterestName changing with interest
    labelSumInterestName.textContent = `سود ${
      currentAccount.interestRate * 100
    } درصد`;
  } else {
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    alert("نام کاربری یا رمز عبور اشتباه است");
  }
});

/////////

// implement transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverACC = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverACC?.username !== currentAccount.username
  ) {
    // add new movement to list
    currentAccount.movements.push(-amount);
    receiverACC?.movements.push(amount);
    // add new movement date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverACC.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);
  } else if (amount > currentAccount.balance) {
    alert("موجودی حساب شما کافی نمیباشد");
  } else if (receiverACC?.username === currentAccount.username) {
    alert("شما حساب خودتان را انتخاب کرده اید");
  }
  // clear and unfocus
  clearUnfocus();
});

////////////
// implement logging out
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const selectedAcc = inputCloseUsername.value;
  const selectedAccPin = Number(inputClosePin.value);

  if (
    selectedAcc === currentAccount.username &&
    selectedAccPin === currentAccount.pin
  ) {
    // const index = accounts.findIndex(
    //   (account) => account.username === currentAccount.username
    // );
    // // delete account data
    // accounts.splice(index, 1);
    // show accounts table
    accountsTable.style.opacity = 100;

    // hide UI and welcome message
    containerApp.style.opacity = 0;
    containerApp.style.transform = "scale(0)";
    labelWelcome.textContent = "نام کاربری و رمز خود را وارد کنید";
    // stop and reset count down
    clearInterval(countDownFn);
    countDownDate = new Date().getTime() + 5 * 60 * 1000 + 1000;
    // clear and unfocus
    clearUnfocus();
  }
});

/////////
// implement loan feature

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const requestedLoan = Math.round(inputLoanAmount.value);
  const biggestDeposit = currentAccount.movements.reduce((acc, cur) =>
    acc > cur ? acc : cur
  );

  if (
    currentAccount.movements.some((mov) => mov >= (requestedLoan * 10) / 100) &&
    requestedLoan > 0
  ) {
    setTimeout(function () {
      currentAccount.movements.push(requestedLoan);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
  } else if (biggestDeposit < (requestedLoan * 10) / 100) {
    alert(
      "شما باید حداقل یک واریزی به مبلغ 10 درصد از وام درخواستی یا بیشتر از 10 درصد از آن داشته باشید"
    );
  }
  // clear and unfocus
  clearUnfocus();
});

//////////////////
// sorting button

let sorting = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorting);
  sorting = !sorting;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
