import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const storedProducts = await AsyncStorage.getItem('@GoMarketplace:products');

      if (storedProducts) {
        setProducts([...JSON.parse(storedProducts)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART

    // check if the product is already in the cart
    const productExists = products.find( storedProduct => storedProduct.id === product.id );

    if (productExists) {
      setProducts(
        products.map(storedProduct =>
          storedProduct.id === product.id
            ? { ...product, quantity: storedProduct.quantity + 1 }
            : storedProduct,
        )
      )
    } else {
      setProducts([...products, { ...product, quantity: 1 }]);
    }

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(products)
    )
  }, [products]);

  const increment = useCallback(async id => {
    // access saved product by id and update its
    setProducts(
      products.map(storedProduct =>
        storedProduct.id === id
          ? { ...storedProduct, quantity: storedProduct.quantity + 1 }
          : storedProduct
      )
    )

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(products)
    )
  }, [products]);

  const decrement = useCallback(async id => {
    // access product, check if is not equal to zero and the decrement it
    const theProduct = await products.find( storedProduct => storedProduct.id === id );

    if (theProduct && theProduct.quantity > 1) {
      setProducts(
        products.map(storedProduct =>
          storedProduct.id === id
            ? { ...storedProduct, quantity: storedProduct.quantity - 1 }
            : storedProduct
        )
      )
    } else if (theProduct && theProduct.quantity === 1) {
      setProducts(
        products.filter(storedProduct => storedProduct.id !== id)
      )
    }

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(products)
    )
  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
