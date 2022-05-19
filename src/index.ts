type Product = {
  productName: string;
  code: string;
  price: number;
  image: string;
};

// Product Catalog Schema
const productsCatalog: Product[] = [
  {
    productName: 'Red Plate',
    code: 'R01',
    price: 32.95,
    image: 'red.png',
  },
  {
    productName: 'Green Plate',
    code: 'G01',
    price: 24.95,
    image: 'green.png',
  },
  {
    productName: 'Blue Plate',
    code: 'B01',
    price: 7.95,
    image: 'blue.png',
  },
];

const offersSchema = {
  productCode: 'R01',
  offer: 0.5,
  deal: 1,
};

const productBucket =
  document.querySelector<HTMLUListElement>('#products-bucket');
const productCatalog =
  document.querySelector<HTMLUListElement>('#product-catalog');
const totalBucket = document.querySelector<HTMLDivElement>('#total-bucket');

let bucket: Product[] = loadFromBucket();
let total = 0;

let delivery = 0;
let offerCounter = true;

const DELIVERYUNDER50 = 4.95;
const DELIVERYUNDER90 = 2.95;
const DELIVERYMORETHAN90 = 0;

// Append cart
bucket.forEach(addProductToBucket);

// Append product list to view
productsCatalog.forEach(loadProductCatelog);

// Add Product to Cart
function addProductToBucket(product: Product, index: number) {
  const item = document.createElement('div');
  const lable = document.createElement('lable');

  const button = document.createElement('button');

  button.addEventListener('click', () => {
    let productPrice = product.price;

    if (offerCounter == false && offersSchema.productCode == product.code) {
      const found = bucket.find((element) => element.code == product.code);
      console.log(found);
      if (found) {
        productPrice = product.price / 2;
        offerCounter = true;
      }
    }

    bucket.splice(index, 1);
    saveBucket();

    total = Math.round((total - Number(productPrice.toFixed(2))) * 100) / 100;

    if (total > 90) {
      delivery = DELIVERYMORETHAN90;
    } else if (50 < total && total < 90) {
      delivery = DELIVERYUNDER90;
    } else if (50 > total && total > 0) {
      delivery = DELIVERYUNDER50;
    } else {
      delivery = 0;
    }

    let totalPriceHTML = `<div class="total-amount">$${(total + delivery)
      .toFixed(2)
      .toString()}</div>`;
    totalBucket!.innerHTML = totalPriceHTML;

    refreshBucket();
  });

  button.innerHTML = 'Remove from bucket';

  item.className = 'Cart-Items';

  let productCartHTML = `<div class="image-box">
      <img src="images/${product.image}" style="{{" height="120px" }} />
    </div>
    <div class="about">
      <h1 class="title">${product.productName}</h1>
      <h3 class="subtitle">${product.code}</h3>
    </div>
    <div class="prices">
      <div class="amount">$${product.price.toString()}</div>
      <div class="remove" id="removePlates-${index}"></div>
    </div>`;

  item.innerHTML = productCartHTML;

  productBucket?.append(item);
  document.getElementById(`removePlates-${index}`)?.append(button);
}

// Load Product List From Local Storage
function loadFromBucket() {
  const bucketJson = localStorage.getItem('BUCKET');

  if (bucketJson == null) return [];

  return JSON.parse(bucketJson);
}

// Save Product Cart to Local Storage
function saveBucket() {
  localStorage.setItem('BUCKET', JSON.stringify(bucket));
}

// Load Product List
function loadProductCatelog(product: Product, index: number) {
  const item = document.createElement('div');
  const lable = document.createElement('lable');
  const button = document.createElement('button');

  button.addEventListener('click', () => {
    let productPrice = product.price;

    if (offerCounter == true && offersSchema.productCode == product.code) {
      const found = bucket.find((element) => element.code == product.code);
      console.log(found);
      if (found) {
        productPrice = product.price / 2;
        offerCounter = false;
      }
    }

    bucket.push(product);
    saveBucket();

    total += productPrice;

    if (total > 90) {
      delivery = DELIVERYMORETHAN90;
    } else if (50 < total && total < 90) {
      delivery = DELIVERYUNDER90;
    } else if (50 > total) {
      delivery = DELIVERYUNDER50;
    } else {
      delivery = 0;
    }

    let totalPriceHTML = `<div class="total-amount">$${(total + delivery)
      .toFixed(2)
      .toString()}</div>`;
    totalBucket!.innerHTML = totalPriceHTML;

    refreshBucket();
  });

  button.innerHTML = 'Add to cart';

  item.className = 'Cart-Items';

  let productHTML = `<div class="image-box">
        <img src="images/${product.image}" style="{{" height="120px" }} />
      </div>
      <div class="about">
        <h1 class="title">${product.productName}</h1>
        <h3 class="subtitle">${product.code}</h3>
      </div>
      <div class="prices">
        <div class="amount">$${product.price.toString()}</div>
        <div class="remove" id="addPlates-${index}"></div>
      </div>`;

  item.innerHTML = productHTML;
  productCatalog?.append(item);
  document.getElementById(`addPlates-${index}`)?.append(button);
}

// Realtime Refresh Bucket
function refreshBucket() {
  productBucket!.innerHTML = '';
  bucket = loadFromBucket();
  bucket.forEach(addProductToBucket);
}
