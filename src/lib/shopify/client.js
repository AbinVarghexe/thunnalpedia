// Shopify Storefront API client with mock data fallback
import { 
  searchProductsQuery,
  customerAccessTokenCreateMutation,
  customerCreateMutation,
  getCustomerQuery,
  customerAddressCreateMutation,
  customerAddressUpdateMutation,
  customerAddressDeleteMutation
} from './queries';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const STOREFRONT_PASSWORD = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PASSWORD;
const API_VERSION = '2024-01';

let cachedEssentialCookie = null;

async function getEssentialCookie() {
  if (cachedEssentialCookie) return cachedEssentialCookie;
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_PASSWORD) return null;

  try {
    const url = `https://${SHOPIFY_STORE_DOMAIN}/password`;
    const body = new URLSearchParams();
    body.append("form_type", "store_front_password");
    body.append("utf8", "✓");
    body.append("password", STOREFRONT_PASSWORD);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      redirect: "manual",
    });

    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      const match = cookies.match(/_shopify_essential=([^;]+)/);
      if (match) {
        cachedEssentialCookie = `_shopify_essential=${match[1]}`;
        return cachedEssentialCookie;
      }
    }
  } catch (error) {
    console.error("Failed to retrieve _shopify_essential cookie:", error);
  }
  return null;
}


// Full high-fidelity mock products data for the "Apple meets Malayalam Typography" theme
const MOCK_PRODUCTS = [
  {
    id: "gid://shopify/Product/1",
    title: "KASAVU SHIRT - METALLIC GOLD",
    handle: "kasavu-shirt-metallic-gold",
    description: "A premium organic cotton shirt featuring traditional handwoven Kerala gold kasavu borders along the button placket and collar. Tailored for a modern, relaxed fit.",
    rating: 4.8,
    reviewCount: 1240,
    originalPrice: "150.00",
    colors: [
      { name: "Gold Plated Ivory", hex: "#FAF9F6" },
      { name: "Charcoal Black", hex: "#1A1A1A" }
    ],
    lifestyleImages: [
      "/products/kasavu-front.png",
      "/products/kasavu-back.png"
    ],
    images: {
      edges: [
        { node: { url: "/products/kasavu-front.png", altText: "Kasavu Shirt - Front view" } },
        { node: { url: "/products/kasavu-back.png", altText: "Kasavu Shirt - Detail view" } },
        { node: { url: "/products/kasavu-front.png", altText: "Kasavu Shirt - Fabric Close-up" } },
        { node: { url: "/products/kasavu-back.png", altText: "Kasavu Shirt - Collar detail" } }
      ]
    },
    variants: {
      edges: [
        { node: { id: "gid://shopify/ProductVariant/11", title: "S", availableForSale: true, price: { amount: "120.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/12", title: "M", availableForSale: true, price: { amount: "120.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/13", title: "L", availableForSale: true, price: { amount: "120.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/14", title: "XL", availableForSale: false, price: { amount: "120.00", currencyCode: "USD" } } }
      ]
    }
  },
  {
    id: "gid://shopify/Product/2",
    title: "MUNDU TROUSERS - RAW COTTON",
    handle: "mundu-trousers-raw-cotton",
    description: "Premium tailored trousers made of raw handspun ivory cotton. Inspired by the traditional Kerala Mundu drape, featuring an asymmetric overlapping front closure.",
    rating: 4.9,
    reviewCount: 850,
    originalPrice: "180.00",
    colors: [
      { name: "Raw Cotton", hex: "#F3EFE0" },
      { name: "Sand Beige", hex: "#D2B48C" }
    ],
    lifestyleImages: [
      "/products/mundu-front.png",
      "/products/mundu-back.png"
    ],
    images: {
      edges: [
        { node: { url: "/products/mundu-front.png", altText: "Mundu Trousers - Front view" } },
        { node: { url: "/products/mundu-back.png", altText: "Mundu Trousers - Back detail" } },
        { node: { url: "/products/mundu-front.png", altText: "Mundu Trousers - Pocket detail" } },
        { node: { url: "/products/mundu-back.png", altText: "Mundu Trousers - Hem detail" } }
      ]
    },
    variants: {
      edges: [
        { node: { id: "gid://shopify/ProductVariant/21", title: "S", availableForSale: true, price: { amount: "145.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/22", title: "M", availableForSale: true, price: { amount: "145.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/23", title: "L", availableForSale: true, price: { amount: "145.00", currencyCode: "USD" } } }
      ]
    }
  },
  {
    id: "gid://shopify/Product/3",
    title: "MALABAR UTILITY JACKET",
    handle: "malabar-utility-jacket",
    description: "A chore jacket constructed from heavy double-weave textured cotton. Trimmed with hand-stinted indigo piping and modern utilitarian magnetic closures.",
    rating: 4.9,
    reviewCount: 3200,
    originalPrice: "230.00",
    colors: [
      { name: "Sage Olive", hex: "#8A9A86" },
      { name: "Indigo Blue", hex: "#2E5894" }
    ],
    lifestyleImages: [
      "/products/jacket-front.png",
      "/products/jacket-back.png"
    ],
    images: {
      edges: [
        { node: { url: "/products/jacket-front.png", altText: "Malabar Utility Jacket - Front view" } },
        { node: { url: "/products/jacket-back.png", altText: "Malabar Utility Jacket - Styling view" } },
        { node: { url: "/products/jacket-front.png", altText: "Malabar Utility Jacket - Weave detail" } },
        { node: { url: "/products/jacket-back.png", altText: "Malabar Utility Jacket - Inside detail" } }
      ]
    },
    variants: {
      edges: [
        { node: { id: "gid://shopify/ProductVariant/31", title: "S", availableForSale: false, price: { amount: "185.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/32", title: "M", availableForSale: true, price: { amount: "185.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/33", title: "L", availableForSale: true, price: { amount: "185.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/34", title: "XL", availableForSale: true, price: { amount: "185.00", currencyCode: "USD" } } }
      ]
    }
  },
  {
    id: "gid://shopify/Product/4",
    title: "NILAVILAKKU OVERSIZED TEE",
    handle: "nilavilakku-oversized-tee",
    description: "Heavyweight 280GSM organic cotton tee in deep carbon black, featuring an abstract graphic representation of the traditional Kerala lamp (Nilavilakku) in bright cinnabar red.",
    rating: 4.7,
    reviewCount: 940,
    originalPrice: "80.00",
    colors: [
      { name: "Carbon Black", hex: "#111111" },
      { name: "Off-White", hex: "#F5F5F5" }
    ],
    lifestyleImages: [
      "/products/tee-front.png",
      "/products/tee-back.png"
    ],
    images: {
      edges: [
        { node: { url: "/products/tee-front.png", altText: "Nilavilakku Tee - Front view" } },
        { node: { url: "/products/tee-back.png", altText: "Nilavilakku Tee - Graphic detail" } },
        { node: { url: "/products/tee-front.png", altText: "Nilavilakku Tee - Cotton texture" } },
        { node: { url: "/products/tee-back.png", altText: "Nilavilakku Tee - Stitch detail" } }
      ]
    },
    variants: {
      edges: [
        { node: { id: "gid://shopify/ProductVariant/41", title: "S", availableForSale: true, price: { amount: "65.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/42", title: "M", availableForSale: true, price: { amount: "65.00", currencyCode: "USD" } } },
        { node: { id: "gid://shopify/ProductVariant/43", title: "L", availableForSale: true, price: { amount: "65.00", currencyCode: "USD" } } }
      ]
    }
  }
];

const MOCK_COLLECTIONS = [
  {
    id: "gid://shopify/Collection/1",
    title: "DROP 04 / WINTER COLLECTION",
    handle: "winter-collection",
    description: "Decoupled structures, premium layering, and traditional handweaving details.",
    image: { url: "/products/collection-cover.png", altText: "Winter Collection Cover" },
    products: { edges: MOCK_PRODUCTS.map(p => ({ node: p })) }
  }
];

export async function shopifyFetch({ query, variables = {}, tags = [] }) {
  // If credentials are not configured, fallback to mock data dynamically
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Check which query is being executed and return relevant mocked node structures
    if (query.includes('products')) {
      if (variables.query) {
        const searchTerm = variables.query.toLowerCase();
        const filtered = MOCK_PRODUCTS.filter(p => 
          p.title.toLowerCase().includes(searchTerm) || 
          p.description.toLowerCase().includes(searchTerm)
        );
        return {
          data: {
            products: {
              edges: filtered.map(product => ({ node: product }))
            }
          }
        };
      }
      return {
        data: {
          products: {
            edges: MOCK_PRODUCTS.map(product => ({ node: product }))
          }
        }
      };
    }
    if (query.includes('collections')) {
      return {
        data: {
          collections: {
            edges: MOCK_COLLECTIONS.map(col => ({ node: col }))
          }
        }
      };
    }
    if (query.includes('cartCreate')) {
      return {
        data: {
          cartCreate: {
            cart: {
              id: "gid://shopify/Cart/mock-cart-id",
              checkoutUrl: "https://checkout.shopify.com/mock-checkout",
              lines: { edges: [] }
            }
          }
        }
      };
    }
    if (query.includes('cartLinesAdd')) {
      return {
        data: {
          cartLinesAdd: {
            cart: {
              id: variables.cartId || "gid://shopify/Cart/mock-cart-id",
              lines: { edges: [] }
            }
          }
        }
      };
    }
    if (query.includes('cartLinesUpdate')) {
      return {
        data: {
          cartLinesUpdate: {
            cart: {
              id: variables.cartId || "gid://shopify/Cart/mock-cart-id",
              lines: { edges: [] }
            }
          }
        }
      };
    }
    if (query.includes('cartLinesRemove')) {
      return {
        data: {
          cartLinesRemove: {
            cart: {
              id: variables.cartId || "gid://shopify/Cart/mock-cart-id",
              lines: { edges: [] }
            }
          }
        }
      };
    }
    if (query.includes('getCart')) {
      return {
        data: {
          cart: {
            id: variables.cartId || "gid://shopify/Cart/mock-cart-id",
            checkoutUrl: "https://checkout.shopify.com/mock-checkout",
            lines: { edges: [] }
          }
        }
      };
    }
    if (query.includes('GetProductByHandle') || query.includes('product(handle:')) {
      const handle = variables.handle;
      const matchedProduct = MOCK_PRODUCTS.find(p => p.handle === handle) || MOCK_PRODUCTS[0];
      return {
        data: {
          product: matchedProduct
        }
      };
    }
    // Mock default response
    return { data: {} };
  }

  // Active production credentials request
  try {
    const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
    const isCustomAppToken = STOREFRONT_ACCESS_TOKEN.startsWith('shpat_');
    const essentialCookie = await getEssentialCookie();
    
    const headers = {
      'Content-Type': 'application/json',
      [isCustomAppToken ? 'X-Shopify-Access-Token' : 'X-Shopify-Storefront-Access-Token']: STOREFRONT_ACCESS_TOKEN,
    };
    
    if (essentialCookie) {
      headers['Cookie'] = essentialCookie;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { tags }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Shopify storefront query failed. Falling back to mocks.", error);
    // Safe fallbacks on failed networks
    if (query.includes('products')) {
      if (variables.query) {
        const searchTerm = variables.query.toLowerCase();
        const filtered = MOCK_PRODUCTS.filter(p => 
          p.title.toLowerCase().includes(searchTerm) || 
          p.description.toLowerCase().includes(searchTerm)
        );
        return { data: { products: { edges: filtered.map(p => ({ node: p })) } } };
      }
      return { data: { products: { edges: MOCK_PRODUCTS.map(p => ({ node: p })) } } };
    }
    if (query.includes('GetProductByHandle') || query.includes('product(handle:')) {
      const handle = variables.handle;
      const matchedProduct = MOCK_PRODUCTS.find(p => p.handle === handle) || MOCK_PRODUCTS[0];
      return { data: { product: matchedProduct } };
    }
    return { data: {} };
  }
}

export async function searchProducts(searchTerm, limit = 5) {
  if (!searchTerm || searchTerm.trim() === '') return [];
  const response = await shopifyFetch({
    query: searchProductsQuery,
    variables: { query: searchTerm, first: limit }
  });
  
  return response?.data?.products?.edges?.map(edge => edge.node) || [];
}

// --- Customer Accounts & Authentication Helpers ---

const getMockCustomers = () => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('thunnal_mock_customers');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  const defaultCustomers = [
    {
      id: "gid://shopify/Customer/1",
      firstName: "Abin",
      lastName: "Suresh",
      email: "abin@example.com",
      password: "password123",
      phone: "+91 98765 43210",
      defaultAddress: {
        id: "gid://shopify/MailingAddress/1",
        address1: "Thunnal House, Baker Road",
        city: "Kottayam",
        province: "Kerala",
        country: "India",
        zip: "686001"
      },
      addresses: [
        {
          id: "gid://shopify/MailingAddress/1",
          address1: "Thunnal House, Baker Road",
          city: "Kottayam",
          province: "Kerala",
          country: "India",
          zip: "686001"
        }
      ],
      orders: [
        {
          id: "gid://shopify/Order/1",
          orderNumber: 1024,
          processedAt: "2026-06-15T14:32:00Z",
          financialStatus: "PAID",
          fulfillmentStatus: "DELIVERED",
          totalPrice: { amount: "120.00", currencyCode: "USD" },
          lineItems: [
            {
              title: "KASAVU SHIRT - METALLIC GOLD",
              quantity: 1,
              variantTitle: "M",
              price: "120.00",
              image: "/products/kasavu-front.png"
            }
          ]
        },
        {
          id: "gid://shopify/Order/2",
          orderNumber: 1089,
          processedAt: "2026-06-21T09:15:00Z",
          financialStatus: "PAID",
          fulfillmentStatus: "IN_TRANSIT",
          totalPrice: { amount: "210.00", currencyCode: "USD" },
          lineItems: [
            {
              title: "MUNDU TROUSERS - RAW COTTON",
              quantity: 1,
              variantTitle: "L",
              price: "145.00",
              image: "/products/mundu-front.png"
            },
            {
              title: "NILAVILAKKU OVERSIZED TEE",
              quantity: 1,
              variantTitle: "L",
              price: "65.00",
              image: "/products/tee-front.png"
            }
          ]
        }
      ]
    }
  ];
  localStorage.setItem('thunnal_mock_customers', JSON.stringify(defaultCustomers));
  return defaultCustomers;
};

const saveMockCustomers = (customers) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('thunnal_mock_customers', JSON.stringify(customers));
};

export async function shopifyLogin(email, password) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Mock login flow
    const customers = getMockCustomers();
    const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (!customer || customer.password !== password) {
      return { error: "Invalid email or password" };
    }

    // Generate a mock token
    const token = "mock_customer_token_" + customer.id.split('/').pop() + "_" + Math.random().toString(36).substring(7);
    
    // Return customer profile without password
    const { password: _, ...cleanCustomer } = customer;
    return { token, customer: cleanCustomer };
  }

  // Shopify Storefront API Request
  const response = await shopifyFetch({
    query: customerAccessTokenCreateMutation,
    variables: {
      input: { email, password }
    }
  });

  const tokenData = response?.data?.customerAccessTokenCreate;
  if (tokenData?.customerUserErrors?.length > 0) {
    return { error: tokenData.customerUserErrors[0].message };
  }

  const token = tokenData?.customerAccessToken?.accessToken;
  if (!token) return { error: "Failed to login. Please try again." };

  const customer = await shopifyGetCustomer(token);
  return { token, customer };
}

export async function shopifySignup(firstName, lastName, email, password) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Mock signup flow
    const customers = getMockCustomers();
    const exists = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return { error: "An account with this email address already exists" };
    }

    const newCustomer = {
      id: "gid://shopify/Customer/" + (customers.length + 1),
      firstName,
      lastName,
      email,
      password,
      phone: "",
      defaultAddress: null,
      addresses: [],
      orders: []
    };

    customers.push(newCustomer);
    saveMockCustomers(customers);

    return { customer: { id: newCustomer.id, email: newCustomer.email } };
  }

  // Shopify Storefront API Request
  const response = await shopifyFetch({
    query: customerCreateMutation,
    variables: {
      input: { firstName, lastName, email, password }
    }
  });

  const createData = response?.data?.customerCreate;
  if (createData?.customerUserErrors?.length > 0) {
    return { error: createData.customerUserErrors[0].message };
  }

  return { customer: createData?.customer };
}

export async function shopifyGetCustomer(token) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Mock profile fetch
    if (token.startsWith("ahoor_oauth_token_")) {
      const savedUser = localStorage.getItem('thunnal_customer_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }

    const customers = getMockCustomers();
    const tokenParts = token.split('_');
    const customerId = tokenParts[3]; // format: mock_customer_token_<id>_<rand>
    const customer = customers.find(c => c.id.endsWith('/' + customerId) || c.id === customerId);
    
    if (!customer) return null;
    const { password: _, ...cleanCustomer } = customer;
    return cleanCustomer;
  }

  // Shopify Storefront API Request
  const response = await shopifyFetch({
    query: getCustomerQuery,
    variables: { customerAccessToken: token }
  });

  const rawCustomer = response?.data?.customer;
  if (!rawCustomer) return null;

  // Map Shopify node arrays to standard arrays
  return {
    id: rawCustomer.id,
    firstName: rawCustomer.firstName,
    lastName: rawCustomer.lastName,
    email: rawCustomer.email,
    phone: rawCustomer.phone,
    defaultAddress: rawCustomer.defaultAddress,
    addresses: rawCustomer.addresses?.edges?.map(edge => edge.node) || [],
    orders: rawCustomer.orders?.edges?.map(edge => {
      const order = edge.node;
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        processedAt: order.processedAt,
        financialStatus: order.financialStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        totalPrice: order.totalPrice,
        lineItems: order.lineItems?.edges?.map(itemEdge => {
          const item = itemEdge.node;
          return {
            title: item.title,
            quantity: item.quantity,
            variantTitle: item.variant?.title,
            price: item.variant?.price?.amount,
            image: item.variant?.image?.url || "/products/placeholder.png"
          };
        }) || []
      };
    }) || []
  };
}

export async function shopifyAddAddress(token, addressData) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Mock address add
    const customers = getMockCustomers();
    const customer = customers.find(c => c.id === getCustomerIdFromToken(token));
    if (!customer) throw new Error("Customer not found");

    const newAddress = {
      id: "gid://shopify/MailingAddress/" + Math.floor(Math.random() * 10000),
      address1: addressData.address1,
      city: addressData.city,
      province: addressData.province,
      country: addressData.country,
      zip: addressData.zip
    };

    customer.addresses.push(newAddress);
    if (!customer.defaultAddress) {
      customer.defaultAddress = newAddress;
    }

    saveMockCustomers(customers);
    const { password: _, ...cleanCustomer } = customer;
    return cleanCustomer;
  }

  // Shopify Storefront API Request
  const response = await shopifyFetch({
    query: customerAddressCreateMutation,
    variables: { customerAccessToken: token, address: addressData }
  });

  const addressResult = response?.data?.customerAddressCreate;
  if (addressResult?.customerUserErrors?.length > 0) {
    throw new Error(addressResult.customerUserErrors[0].message);
  }

  return shopifyGetCustomer(token);
}

export async function shopifyUpdateAddress(token, addressId, addressData) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Mock address update
    const customers = getMockCustomers();
    const customer = customers.find(c => c.id === getCustomerIdFromToken(token));
    if (!customer) throw new Error("Customer not found");

    const addressIndex = customer.addresses.findIndex(a => a.id === addressId);
    if (addressIndex === -1) throw new Error("Address not found");

    const updatedAddress = {
      ...customer.addresses[addressIndex],
      address1: addressData.address1,
      city: addressData.city,
      province: addressData.province,
      country: addressData.country,
      zip: addressData.zip
    };

    customer.addresses[addressIndex] = updatedAddress;
    if (customer.defaultAddress?.id === addressId) {
      customer.defaultAddress = updatedAddress;
    }

    saveMockCustomers(customers);
    const { password: _, ...cleanCustomer } = customer;
    return cleanCustomer;
  }

  // Shopify Storefront API Request
  const response = await shopifyFetch({
    query: customerAddressUpdateMutation,
    variables: { customerAccessToken: token, id: addressId, address: addressData }
  });

  const addressResult = response?.data?.customerAddressUpdate;
  if (addressResult?.customerUserErrors?.length > 0) {
    throw new Error(addressResult.customerUserErrors[0].message);
  }

  return shopifyGetCustomer(token);
}

export async function shopifyDeleteAddress(token, addressId) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    // Mock address delete
    const customers = getMockCustomers();
    const customer = customers.find(c => c.id === getCustomerIdFromToken(token));
    if (!customer) throw new Error("Customer not found");

    customer.addresses = customer.addresses.filter(a => a.id !== addressId);
    if (customer.defaultAddress?.id === addressId) {
      customer.defaultAddress = customer.addresses[0] || null;
    }

    saveMockCustomers(customers);
    const { password: _, ...cleanCustomer } = customer;
    return cleanCustomer;
  }

  // Shopify Storefront API Request
  const response = await shopifyFetch({
    query: customerAddressDeleteMutation,
    variables: { customerAccessToken: token, id: addressId }
  });

  const deleteResult = response?.data?.customerAddressDelete;
  if (deleteResult?.customerUserErrors?.length > 0) {
    throw new Error(deleteResult.customerUserErrors[0].message);
  }

  return shopifyGetCustomer(token);
}

// Helpers
function getCustomerIdFromToken(token) {
  if (token.startsWith("ahoor_oauth_token_")) {
    return "gid://shopify/Customer/ahoor-999";
  }
  const tokenParts = token.split('_');
  const customerId = tokenParts[3]; // format: mock_customer_token_<id>_<rand>
  return "gid://shopify/Customer/" + customerId;
}
