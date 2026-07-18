const products = [
  { id: 1, name: 'Chompa de alpaca', description: 'Chompa suave hecha con lana de alpaca.', price: 220, category: 'Chompa', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 2, name: 'Chalina tejida', description: 'Chalina cálida y elegante para el frío.', price: 95, category: 'Chalina', sizes: ['Única'] },
  { id: 3, name: 'Guantes de alpaca', description: 'Guantes abrigadores con acabado fino.', price: 60, category: 'Guantes', sizes: ['S', 'M', 'L'] },
  { id: 4, name: 'Poncho andino', description: 'Poncho tradicional hecho a mano.', price: 280, category: 'Poncho', sizes: ['Única'] }
];
const dniDatabase = {
  '12345678': 'Ana',
  '87654321': 'Luis',
  '11223344': 'María',
  '44332211': 'José'
};
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const dniInput = document.getElementById('dniInput');
const dniButton = document.getElementById('dniButton');
const dniMessage = document.getElementById('dniMessage');
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');
const orderSize = document.getElementById('orderSize');
const adminForm = document.getElementById('adminForm');
const adminMessage = document.getElementById('adminMessage');
const adminProductList = document.getElementById('adminProductList');
const adminName = document.getElementById('adminName');
const adminDescription = document.getElementById('adminDescription');
const adminPrice = document.getElementById('adminPrice');
const adminCategory = document.getElementById('adminCategory');

function renderProducts(items) {
  productGrid.innerHTML = items.map(product => `
    <article class="product-card">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">S/ ${product.price}</p>
      <p><strong>Tallas:</strong> ${product.sizes ? product.sizes.join(', ') : 'Única'}</p>
      <button class="btn btn-primary" onclick="addToOrder('${product.name}')">Reservar / Comprar</button>
    </article>
  `).join('');
}

function renderAdminProducts() {
  const productsStored = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  adminProductList.innerHTML = productsStored.length
    ? productsStored.map(item => `
        <div class="admin-item">
          <strong>${item.name}</strong> · ${item.category} · S/ ${item.price}<br />
          <span>${item.description}</span>
        </div>
      `).join('')
    : '<p>No hay productos nuevos. Agrega uno desde el formulario.</p>';
}

function addToOrder(name) {
  const orderProduct = document.getElementById('orderProduct');
  orderProduct.value = name;
  updateSizeOptions(name);
  orderProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateSizeOptions(productName) {
  const product = products.find(item => item.name === productName);
  orderSize.innerHTML = '<option value="">Selecciona una talla</option>';
  if (!product || !product.sizes) {
    orderSize.disabled = true;
    return;
  }
  orderSize.disabled = false;
  product.sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    orderSize.appendChild(option);
  });
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query) || product.category.toLowerCase().includes(query));
  renderProducts(filtered);
}

searchInput.addEventListener('input', filterProducts);

document.getElementById('orderProduct').addEventListener('change', event => {
  updateSizeOptions(event.target.value);
});

dniButton.addEventListener('click', () => {
  const dni = dniInput.value.trim();
  if (!/^[0-9]{8}$/.test(dni)) {
    dniMessage.textContent = 'Por favor ingresa un DNI válido de 8 dígitos.';
    dniMessage.style.color = '#b33f24';
    return;
  }

  const name = dniDatabase[dni];
  if (name) {
    dniMessage.textContent = `Hola ${name}, gracias por visitar MANOS ANDINAS.`;
    dniMessage.style.color = '#3a5f35';
  } else {
    dniMessage.textContent = 'DNI correcto. Te damos la bienvenida. Introduce tu nombre en el pedido para personalizar tu compra.';
    dniMessage.style.color = '#3a5f35';
  }
});

orderForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('orderName').value.trim();
  const email = document.getElementById('orderEmail').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const product = document.getElementById('orderProduct').value;
  const size = orderSize.value;
  const quantity = parseInt(document.getElementById('orderQuantity').value, 10);
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  if (!name || !email || !phone || !product || !size || !quantity || quantity < 1) {
    orderMessage.textContent = 'Por favor completa todos los campos correctamente, incluida la talla.';
    orderMessage.style.color = '#b33f24';
    return;
  }

  if (!/^[0-9]{9}$/.test(phone)) {
    orderMessage.textContent = 'El teléfono debe tener 9 dígitos.';
    orderMessage.style.color = '#b33f24';
    return;
  }

  orderMessage.textContent = `Pedido recibido: ${quantity} × ${product} (Talla ${size}). Forma de pago: ${paymentMethod}. Te contactaremos pronto.`;
  orderMessage.style.color = '#3a5f35';
  orderForm.reset();
  orderSize.innerHTML = '<option value="">Selecciona una talla</option>';
  orderSize.disabled = true;
});

adminForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = adminName.value.trim();
  const description = adminDescription.value.trim();
  const price = Number(adminPrice.value);
  const category = adminCategory.value;

  if (!name || !description || !price || price <= 0) {
    adminMessage.textContent = 'Completa todos los campos del producto antes de agregar.';
    adminMessage.style.color = '#b33f24';
    return;
  }

  const productsStored = JSON.parse(localStorage.getItem('adminProducts') || '[]');
  productsStored.unshift({ name, description, price, category });
  localStorage.setItem('adminProducts', JSON.stringify(productsStored));
  adminMessage.textContent = 'Producto agregado correctamente. Se mostrará en el listado.';
  adminMessage.style.color = '#3a5f35';
  adminForm.reset();
  renderAdminProducts();
});

window.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  renderAdminProducts();
  orderSize.disabled = true;
});
