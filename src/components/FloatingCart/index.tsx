import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';


const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    // isolate each product total value in an array
    const values = products.map(product => product.price * product.quantity);

    // sum the values array
    const totalPrice = values.reduce(
      (acummulator, value) => {
        return acummulator += value;
      },
      0,
    );

    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {

    const totalItems = products.reduce(
      (accumulator, product) => {
        return accumulator += product.quantity;
      },
      0,
    )

    return totalItems;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
