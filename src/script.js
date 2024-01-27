import './input.css';

//NPM RUN DEV för att köra VITE

/* Variabler */
const section = document.querySelector('#donuts');
const header = document.querySelector('#header');
const priceDiv = document.querySelector('#price');
const updateCartDiv = document.querySelector('#updateCart');
const errorForm = document.querySelector('#errorForm');
let cartAmount = 0;
let totalAmount = 0;

const tooday = new Date();
let slownessTimeout = setTimeout(slowCustomer, 1000 * 60 * 15);

/* Arrays */
const donuts = [
  {
    name: 'Vit choklad',
    rating: 3.5,
    price: 15,
    amount: 0,
    img: {
      src: './donuts0.webp',
      alt: 'Bild på Vit choklads munk',
    },
    category: 'white',
  },
  {
    name: 'Chokladmunk',
    rating: 3,
    price: 20,
    amount: 0,
    img: {
      src: './donuts1.webp',
      alt: 'Bild på mjölk choklads munk',
    },
    category: 'chocolate',
  },
  {
    name: 'Mandeldröm',
    rating: 2,
    price: 19,
    amount: 0,
    img: {
      src: './donuts2.webp',
      alt: 'Bild på mandel munk',
    },
    category: 'white',
  },
  {
    name: 'Klassisk',
    rating: 3,
    price: 10,
    amount: 0,
    img: {
      src: './donuts3.webp',
      alt: 'Bild på klassisk munk',
    },
    category: 'other',
  },
  {
    name: 'Födelsedags munk',
    rating: 4,
    price: 20,
    amount: 0,
    img: {
      src: './donuts4.webp',
      alt: 'Bild på födelsedagsmunk',
    },
    category: 'other',
  },
  {
    name: 'Chokladbomb',
    rating: 5,
    price: 25,
    amount: 0,
    img: {
      src: './donuts5.webp',
      alt: 'Bild på chokladbombs munk',
    },
    category: 'chocolate',
  },
  {
    name: 'Chocolate and cookies',
    rating: 4.5,
    price: 22,
    amount: 0,
    img: {
      src: './donuts6.webp',
      alt: 'Bild på chocolate and cookies munk',
    },
    category: 'white',
  },
  {
    name: 'Rosa pantern',
    rating: 2.5,
    price: 22,
    amount: 0,
    img: {
      src: './donuts7.webp',
      alt: 'Bild på rosa panter munk',
    },
    category: 'other',
  },
  {
    name: 'Double chocolate',
    rating: 5,
    price: 20,
    amount: 0,
    img: {
      src: './donuts8.webp',
      alt: 'bild på double chocolate munk',
    },
    category: 'chocolate',
  },
  {
    name: 'Citron munk',
    rating: 2,
    price: 18,
    amount: 0,
    img: {
      src: './donuts9.webp',
      alt: 'Bild på citron munk',
    },
    category: 'other',
  },
];

//Helgpåslag
if ((tooday.getDay() === 6 && tooday.getHours() >= 15) || (tooday.getDay() === 1 && tooday.getHours() <= 3)) {
  for (let i = 0; i < donuts.length; i++) {
    donuts[i].price = Math.trunc(donuts[i].price * 1.15);
  }
}

/* SKAPA SIDANS LAYOUT */

// Header
header.innerHTML += `
<h1 class="font-fontKdam ml-4 text-4xl">Gottfrids munkfabrik</h1>
        <div class="w-16 mr-4">
          <div>
            <input
              class="bg-orange-500 rounded-full absolute right-3 top-1 w-6 text-center font-fontKdam font-bold text-sm pointer-events-none hidden"
              type="number"
              value="${cartAmount}"
              tabindex="-1"
              readonly
            />
          </div>
          <button id="showCart" type="button">
            <div class="hover:scale-125 ease-in-out transition-transform duration-500">
              <img src="./cart-2-svgrepo-com.svg" alt="Ikon på en varukorg" width="70px" height="70px" />
            </div>
          </button>
        </div>`;

// Page section
for (let i = 0; i < donuts.length; i++) {
  const isChokladbomb = donuts[i].name === 'Chokladbomb';
  const kundfavoritenLabel = isChokladbomb
    ? '<span class="bg-orange-400 p-1 rounded inline-block rotate-12">Kundfavoriten!</span>'
    : '';

  section.innerHTML += `<article id="donut-${i}" class="flex justify-around gap-3 flex-col font-fontKdam items-center w-screen md:w-1/2 lg:w-1/4 p-2">
      <div class="w-auto h-auto">
        <img src="${donuts[i].img.src}" alt="${donuts[i].img.alt}" width="300px" height="300px">
      </div>
      <div class="font-bold">${donuts[i].name} ${kundfavoritenLabel}</div>
      <div>${donuts[i].price} kr/st</div>
      <div>${donuts[i].rating} stjärnor</div>
      <div class="flex gap-2">
      <button id="subtract-${i}" class="subtract text-3xl bg-black text-white pl-3 pr-3 hover:bg-orange-500">-</button>
      <input aria-label="currentcount-${i}"  id="currentcount-${i}" name="currentcount-${i}" class="border-2 border-stone-800 text-center lg:w-28 pointer-events-none" type="number" value="${donuts[i].amount}" tabindex="-1"/>
      <button id="add-${i}" class="add text-3xl bg-black text-white pl-2 pr-2 hover:bg-orange-500">+</button>
    </div>
    </article>`;
}

// Total summa rutan
priceDiv.innerHTML += `
<div class="bg-orange-600 w-auto h-auto rounded-2xl fixed bottom-32 left-1/2 -translate-x-1/2 -translate-y-1/2 font-fontKdam text-2xl p-2 hidden">Totalt: ${totalAmount} kr</div>
`;

//
updateCartDiv.innerHTML = 'Varukorgen är tom';

//  Selektar alla .add och .subtract klasserna och tilldelar Eventlistener till de.
const addButtons = Array.from(document.querySelectorAll('.add'));
for (let i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener('click', increaseAmount);
}

const minusButtons = Array.from(document.querySelectorAll('.subtract'));
for (let i = 0; i < minusButtons.length; i++) {
  minusButtons[i].addEventListener('click', decreaseAmount);
}

/* Event listener */

const showCart = document.querySelector('#showCart');
showCart.addEventListener('click', toggleCart);

/* Tom */

/* Funktioner */
//  Använd denna funktion för att uppdatera sidan igen efter att den nollställs
function updatePage() {
  header.innerHTML += `
  <h1 class="font-fontKdam ml-4 text-4xl">Gottfrids munkfabrik</h1>
          <div class="w-16 mr-4">
            <div>
              <input
                class="bg-orange-500 rounded-full absolute right-3 top-1 w-6 text-center font-fontKdam font-bold text-sm pointer-events-none"
                type="number"
                value="${cartAmount}"
                tabindex="-1"
                readonly
              />
            </div>
            <button id="showCart" type="button">
              <div class="hover:scale-125 ease-in-out transition-transform duration-500">
                <img src="./cart-2-svgrepo-com.svg" alt="Ikon på en varukorg" width="70px" height="70px" />
              </div>
            </button>
          </div>`;

  for (let i = 0; i < donuts.length; i++) {
    const isChokladbomb = donuts[i].name === 'Chokladbomb';
    const kundfavoritenLabel = isChokladbomb
      ? '<span class="bg-orange-400 p-1 rounded inline-block rotate-12">Kundfavoriten!</span>'
      : '';

    section.innerHTML += `<article id="donut-${i}" class="flex justify-around gap-3 flex-col font-fontKdam items-center w-screen md:w-1/2 lg:w-1/4 p-2">
        <div class="w-auto h-auto">
          <img src="${donuts[i].img.src}" alt="${donuts[i].img.alt}" width="300px" height="300px">
        </div>
        <div class="font-bold">${donuts[i].name} ${kundfavoritenLabel}</div>
        <div>${donuts[i].price} kr/st</div>
        <div>${donuts[i].rating} stjärnor</div>
        <div class="flex gap-2">
        <button id="subtract-${i}" class="subtract text-3xl bg-black text-white pl-3 pr-3 hover:bg-orange-500">-</button>
        <input aria-label="currentcount-${i}" id="currentcount-${i}" name="currentcount-${i}" class="border-2 border-stone-800 text-center lg:w-28 pointer-events-none" type="number" value="${donuts[i].amount}" tabindex="-1"/>
        <button id="add-${i}" class="add text-3xl bg-black text-white pl-2 pr-2 hover:bg-orange-500">+</button>
      </div>
      </article>`;
  }

  const addButtons = Array.from(document.querySelectorAll('.add'));
  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', increaseAmount);
  }

  const minusButtons = Array.from(document.querySelectorAll('.subtract'));
  for (let i = 0; i < minusButtons.length; i++) {
    minusButtons[i].addEventListener('click', decreaseAmount);
  }

  // Om kundkorgen är 0 i antal så kommer inte antalet eller priset att visas visuellt
  // Om det är över 0 så kommer en visuell ändring att ske i form av pris och antal
  const cartInput = document.querySelector('.bg-orange-500');
  const amountDiv = document.querySelector('.bg-orange-600');

  cartInput.value = cartAmount;

  if (cartAmount > 0) {
    cartInput.classList.remove('hidden');
    amountDiv.classList.remove('hidden');
  } else if (cartAmount === 0) {
    cartInput.classList.add('hidden');
    amountDiv.classList.add('hidden');
  }

  const showCart = document.querySelector('#showCart');
  showCart.addEventListener('click', toggleCart);
}

function printCartDonuts() {
  let msg = '';
  let discountedTotalAmount = 0;
  let orderedDonutAmount = 0;

  updateCartDiv.innerHTML = '';

  donuts.forEach(donut => {
    orderedDonutAmount += donut.amount;

    if (donut.amount > 0) {
      let donutPrice = donut.price;
      if (donut.amount > 10) {
        donutPrice *= 0.9;
      }

      const donutTotalPrice = donut.amount * donutPrice;

      updateCartDiv.innerHTML += `
      <article class="flex justify-between gap-20">
      <div class="w-auto h-auto">
        <img src="${donut.img.src}" alt="${donut.img.alt}" width="150px" height="150px">
      </div>
      <div class="mt-4 flex flex-col gap-2 items-center">
        <div class="font-bold">${donut.name} - ${donut.price} kr</div>
        <div class="">Antal: ${donut.amount} st</div>
        <div class="">Summa: ${donutTotalPrice} kr</div>
        <div class="flex gap-3">
          <button class="subtract text-3xl bg-black text-white pl-4 pr-4 hover:bg-orange-500">-</button>
          <button class="add text-3xl bg-black text-white pl-3 pr-3 hover:bg-orange-500">+</button>
        </div>
      </div>
      </article>
      `;

      discountedTotalAmount += donutTotalPrice;
    }
  });

  if (totalAmount < 0) {
    return;
  }

  //Specialregel: 15% Påslag fredag
  if ((tooday.getDay() === 6 && tooday.getHours() >= 15) || (tooday.getDay() === 1 && tooday.getHours() <= 3)) {
    discountedTotalAmount *= 1.15;
  }

  //Specialregel: Måndag 10% Rabatt
  if (tooday.getDay() === 1 && tooday.getHours() < 10) {
    discountedTotalAmount *= 0.9;
    msg += '<p>Måndagsrabatt: 10 % på hela beställningen!</p>';
  }

  updateCartDiv.innerHTML += `<span>Att betala: ${Math.trunc(discountedTotalAmount)} kr</span>`;
  updateCartDiv.innerHTML += `${msg}`;

  //Specialregel: Gratis frakt om man beställt över 15 munkar
  if (orderedDonutAmount > 15) {
    updateCartDiv.innerHTML += '<span>Frakt: 0 kr</span>';
  } else {
    updateCartDiv.innerHTML += `<span>Frakt: ${Math.trunc(25 + 0.1 * discountedTotalAmount)} kr</span>`;
  }

  priceDiv.innerHTML = `
  <div class="bg-orange-600 w-auto h-auto rounded-2xl fixed bottom-32 left-1/2 -translate-x-1/2 -translate-y-1/2 font-fontKdam text-2xl p-2">
    Totalt: ${Math.trunc(discountedTotalAmount)} kr
  </div>`;

  //  KOD FÖR ATT STÄNGA AV FAKTURA NÄR SUMMAN ÄR ÖVER 800 KR
  const invoiceRadio = document.querySelector('#radioInvoice');
  const noInvoice = document.querySelector('#noInvoice');
  if (discountedTotalAmount > Number(800)) {
    invoiceRadio.setAttribute('disabled', '');
    noInvoice.innerHTML += `<p>Faktura går ej att använda för värden som överstiger 800 kr</p>`;
  } else {
    invoiceRadio.removeAttribute('disabled');
    noInvoice.innerHTML = '';
  }
}

function toggleCart() {
  const cartSection = document.querySelector('#cartSection');

  if (cartSection.classList.contains('hidden')) {
    cartSection.classList.remove('hidden');
  } else {
    cartSection.classList.add('hidden');
  }
}

function increaseAmount(e) {
  //  plockar up ID:t från knappen som man har tryckt på
  //  ta bort texten "add-" från id:t så att vi endast får siffran
  //  siffran motsvarar platsen för donut:en i array:en

  const index = e.target.id.replace('add-', '');

  //  Uppdatera munkens egenskaper med att plussa ett i antal
  donuts[index].amount += 1;

  //  Uppdatera kundkorgen med att plussa ett i antal
  cartAmount += 1;

  // Uppdatera priset
  totalAmount += donuts[index].price;

  //  Nollställ informationen i div:en med alla produkter
  section.innerHTML = '';
  header.innerHTML = '';

  //  Anropar på updatePage funktionen som uppdaterar sidan igen efter nollställningen
  updatePage();

  // Anropar på printCartDonuts funktionen för att uppdatera kundkorgen
  printCartDonuts();
}

function decreaseAmount(e) {
  //  plockar up ID:t från knappen som man har tryckt på
  //  ta bort texten "subtract-" från id:t så att vi endast får siffran
  //  siffran motsvarar platsen för donut:en i array:en

  const index = e.target.id.replace('subtract-', '');

  //  Uppdatera munkens egenskaper med att subtrahera ett i antal
  if (donuts[index].amount - 1 < 0) {
    return;
  }
  donuts[index].amount -= 1;

  //  Uppdatera kundkorgen med att subtrahera ett i antal
  if (cartAmount - 1 < 0) {
    return;
  }
  cartAmount -= 1;

  // Uppdatera priset
  if (totalAmount - 1 < 0) {
    return;
  }
  totalAmount -= donuts[index].price;

  //  Nollställ informationen i div:en med alla produkter
  section.innerHTML = '';
  header.innerHTML = '';

  //  Anropar på updatePage funktionen som uppdaterar sidan igen efter nollställningen
  updatePage();

  // Anropar på printCartDonuts funktionen för att uppdatera kundkorgen
  printCartDonuts();
}

// Funktion för att endast kunna använda siffor på inputs
function validateNumberInput(input) {
  // Remove non-numeric characters
  input.value = input.value.replace(/[^0-9]/g, '');
}

/* 
------------------------------------------------------
----------------------- FORM & PAYMENT ---------------
------------------------------------------------------
 */

const cardInvoiceRadios = Array.from(document.querySelectorAll('input[name="payment-option"]'));
const inputs = [
  document.querySelector('#cardnumber'),
  document.querySelector('#year'),
  document.querySelector('#month'),
  document.querySelector('#cvc'),
  document.querySelector('#personalNumber'),
  document.querySelector('#name'),
  document.querySelector('#surname'),
  document.querySelector('#adress'),
  document.querySelector('#postnumber'),
  document.querySelector('#postaladdress'),
  document.querySelector('#phone'),
  document.querySelector('#email'),
  document.querySelector('#checkPerson'),
];

const invoiceOption = document.querySelector('#invoiceForm');
const cardOption = document.querySelector('#cardForm');
const orderBtn = document.querySelector('#payButton');

// Default options
let selectedPaymentOption = 'card';
let errorShown = false;

// REGEX
const personalIdRegEx = new RegExp(/^(\d{10}|\d{12}|\d{6}-\d{4}|\d{8}-\d{4}|\d{8} \d{4}|\d{6} \d{4})/);
const creditCardNumberRegEx = new RegExp(
  /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
);
const phoneNumberRegEx = new RegExp(/^(?:(?:(?:\+|00)46)|0)7[02369]\d{7}$/);
const emailAdressRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

// Add event listeners
inputs.forEach(input => {
  input.addEventListener('focusout', activateOrderButton);
  input.addEventListener('change', activateOrderButton);
});

cardInvoiceRadios.forEach(radioBtn => {
  radioBtn.addEventListener('change', switchPaymentMethod);
});

/**
 * Switches between invoice payment method and
 * card payment method. Toggles their visibility.
 */
function switchPaymentMethod(e) {
  invoiceOption.classList.toggle('hidden');
  cardOption.classList.toggle('hidden');

  selectedPaymentOption = e.target.value;
}

function isPersonalIdNumberValid() {
  return personalIdRegEx.exec(inputs[4].value);
}

function isPhoneNumberValid() {
  return phoneNumberRegEx.exec(inputs[10].value);
}

function isEmailValid() {
  return emailAdressRegEx.exec(inputs[11].value);
}

/**
 * Activate order button if all fields are
 * correctly filled.
 */
function activateOrderButton() {
  orderBtn.setAttribute('disabled', '');

  // Checks if error is already showing.
  // Resets red error color
  if (errorShown) {
    errorForm.innerHTML = '';
    errorShown = false;
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].classList.remove('bg-red-500');
    }
  }
  // Check if cart is empty
  if (cartAmount === 0) {
    errorForm.innerHTML += `Var vänlig och fyll i kundkorgen`;
    errorShown = true;
    return;
  }

  // Check if name is empty
  if (inputs[5].value === '') {
    errorForm.innerHTML += `Var vänlig och fyll i namn`;
    errorShown = true;
    inputs[5].classList.add('bg-red-500');
    return;
  }

  // Check if surname is empty
  if (inputs[6].value === '') {
    errorForm.innerHTML += `Var vänlig och fyll i efternamn`;
    errorShown = true;
    inputs[6].classList.add('bg-red-500');
    return;
  }

  // Check if adress is empty
  if (inputs[7].value === '') {
    errorForm.innerHTML += `Var vänlig och fyll i adress`;
    errorShown = true;
    inputs[7].classList.add('bg-red-500');
    return;
  }

  // Check if postnumber is empty
  if (inputs[8].value === '') {
    errorForm.innerHTML += `Var vänlig och fyll i postnummer`;
    errorShown = true;
    inputs[8].classList.add('bg-red-500');
    return;
  }

  // Check if postaladress is empty
  if (inputs[9].value === '') {
    errorForm.innerHTML += `Var vänlig och fyll i postort`;
    errorShown = true;
    inputs[9].classList.add('bg-red-500');
    return;
  }

  // Check if phone is valid
  if (!isPhoneNumberValid()) {
    errorForm.innerHTML += `Var vänlig och ange korrekt mobilnummer`;
    errorShown = true;
    inputs[10].classList.add('bg-red-500');
    return;
  }

  // Check if email is valid
  if (!isEmailValid()) {
    errorForm.innerHTML += `Var vänlig och ange korrekt epost-adress`;
    errorShown = true;
    inputs[11].classList.add('bg-red-500');
    return;
  }

  // Check if personal number is valid or not
  if (selectedPaymentOption === 'invoice' && !isPersonalIdNumberValid()) {
    errorForm.innerHTML += `Var vänlig och ange korrekt personnummer`;
    errorShown = true;
    inputs[4].classList.add('bg-red-500');
    return;
  }

  if (selectedPaymentOption === 'card') {
    // Check card number
    if (creditCardNumberRegEx.exec(inputs[0].value) === null) {
      errorForm.innerHTML += `Var vänlig och ange korrekt kortnummer`;
      errorShown = true;
      inputs[0].classList.add('bg-red-500');
      return;
    }

    // Check card year
    let year = Number(inputs[1].value);
    const today = new Date();
    const shortYear = Number(String(today.getFullYear()).substring(2));

    if (year > shortYear + 2 || year < shortYear) {
      errorForm.innerHTML += `Var vänlig och ange ett giltigt år`;
      errorShown = true;
      inputs[1].classList.add('bg-red-500');
      return;
    }

    // Check card month
    let month = Number(inputs[2].value);
    if (month < 1 || month > 12) {
      errorForm.innerHTML += `Var vänlig och ange en giltig månad`;
      errorShown = true;
      inputs[2].classList.add('bg-red-500');
      return;
    }

    // Check card CVC
    if (inputs[3].value.length !== 3) {
      errorForm.innerHTML += `Var vänlig och ange korrekt CVC nummer`;
      errorShown = true;
      inputs[3].classList.add('bg-red-500');
      return;
    }
  }

  // Check if personal data checkbox is checked or not
  if (!inputs[12].checked) {
    errorForm.innerHTML += `Var vänlig och kryssa i behandling av personuppgifter`;
    errorShown = true;
    inputs[12].classList.add('bg-red-500');
    return;
  }
  orderBtn.removeAttribute('disabled');
}

//Återställ beställning

const resetButton = document.querySelector('#resetButton');

resetButton.addEventListener('click', resetForm);

function resetForm() {
  cartAmount = 0;
  totalAmount = 0;

  for (let i = 0; i < donuts.length; i++) {
    donuts[i].amount = 0;
  }

  section.innerHTML = '';
  header.innerHTML = '';

  printCartDonuts();
  updatePage();
}

// Betalning

orderBtn.addEventListener('click', payment);

function payment() {
  const cartSection = document.querySelector('#cartSection');

  cartSection.innerHTML = '';

  cartSection.innerHTML += `
  <div id="payment" class="flex flex-col items-center mt-32">
  <img src="./paymentDonut.png" width="100 px" alt="">
  <h2 class="text-2xl"><span class="text-pink-500">Tack</span> för att du valde att handla hos oss!</h2>
  <span class="text-sm mt-2">Du kommer snart att få en bekräftelse-mejl och kvitto. Håll utkik där!</span>
  <span class="text-sm">När ordern är redo att plockas kommer du att få ett sms</span>
  <span class="mt-4">Beräknad leveranstid:</span>
  <span class="text-orange-500">2 dagar</span>
</div>`;
}

// Kod för långsam kund, 15 min timer
function slowCustomer() {
  alert('Du är för långsam på att beställa!');
  resetForm();
}

// kod för att sortera donuts

let currentSortButton = null;

function sortDonuts(criteria) {
  switch (criteria) {
    case 'name':
      donuts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      donuts.sort((a, b) => b.rating - a.rating);
      break;
    case 'price':
      donuts.sort((a, b) => a.price - b.price);
      break;
    case 'category':
      donuts.sort((a, b) => a.category.localeCompare(b.category));
      break;
    default:
      break;
  }

  section.innerHTML = '';
  header.innerHTML = '';

  updatePage();

  if (currentSortButton) {
    currentSortButton.classList.remove('bg-orange-500');
    currentSortButton.classList.add('bg-gray-200');
  }

  const clickedButton = document.getElementById(`sort${criteria.charAt(0).toUpperCase() + criteria.slice(1)}`);

  if (clickedButton) {
    clickedButton.classList.remove('bg-gray-200');
    clickedButton.classList.add('bg-orange-500');
    currentSortButton = clickedButton;
  } else {
    console.log('Clicked button not found:', criteria);
  }
}

document.getElementById('sortName').addEventListener('click', () => sortDonuts('name'));
document.getElementById('sortCategory').addEventListener('click', () => sortDonuts('category'));
document.getElementById('sortRating').addEventListener('click', () => sortDonuts('rating'));
document.getElementById('sortPrice').addEventListener('click', () => sortDonuts('price'));
