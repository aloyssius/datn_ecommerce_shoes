import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react';
import { CLIENT_API } from '../api/apiConfig';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import useNotification from '../hooks/useNotification';
import { LOCAL_STORAGE_CART_ITEMS_KEY } from '../enum/enum';
import { PATH_PAGE } from '../routes/path';

const initialState = {
  onUpdateCart: () => { },
  onUpdateCartSize: () => { },
  onUpdateCartQuantity: () => { },
  onRemoveCartItem: () => { },
  cartItems: [],
  totalCart: 0,
  onUpdateVoucher: () => { },
  resetCart: () => { },
}

const UserContext = createContext(initialState);

UserProvider.propTypes = {
  children: PropTypes.node,
}

function UserProvider({ children }) {

  const { fetch, remove, post, put } = useFetch(null, { fetch: false });
  const { authUser, isInitialized } = useAuth();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const location = useLocation();
  const history = useHistory();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (authUser && isInitialized && location.pathname === PATH_PAGE.cart.root) {
      fetch(CLIENT_API.cart.all_account(authUser?.id), null, (res) => onFinishGetAllCartItem(res));
    }

    if (!authUser && isInitialized && location.pathname === PATH_PAGE.cart.root) {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_CART_ITEMS_KEY);
      const cartItemsCurrent = storedValue ? JSON.parse(storedValue) : [];

      if (cartItemsCurrent.length > 0) {
        const body = {
          ids: cartItemsCurrent.map((item) => item.id),
        }
        fetch(CLIENT_API.cart.all, body, (res) => onFinishGetAllCartItem(res, cartItemsCurrent));
      }
      else {
        setCartItems([]);
      }

    }

  }, [authUser, isInitialized, location.pathname]);

  useEffect(() => {
    if (authUser && isInitialized && location.pathname !== PATH_PAGE.cart.root) {
      setCartItems(authUser?.cartItems);
    }

    if (!authUser && isInitialized && location.pathname !== PATH_PAGE.cart.root) {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_CART_ITEMS_KEY);
      const cartItemsCurrent = storedValue ? JSON.parse(storedValue) : [];

      if (cartItemsCurrent.length > 0) {
        const body = {
          ids: cartItemsCurrent.map((item) => item.id),
        }
        fetch(CLIENT_API.cart.all, body, (res) => onFinishGetAllCartItem(res, cartItemsCurrent));
      }
      else {
        setCartItems([]);
      }
    }

  }, [authUser, isInitialized]);

  const onFinishGetAllCartItem = (newData, currentData) => {

    if (authUser) {
      setCartItems(newData);
    }
    else {
      const updatedCartItems = currentData.map((currentItem) => {
        const newItem = newData.find((newItem) => newItem.id === currentItem.id);

        if (newItem) {
          return {
            ...newItem,
            quantity: currentItem?.quantity,
            createdAt: currentItem?.createdAt,
          }
        }

        return currentItem;
      }).filter((item) => {
        return newData?.some((newItem) => newItem?.id === item.id);
      });

      sortByDate(updatedCartItems);
      setCartItems(updatedCartItems);
      localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(updatedCartItems));
    }

  }

  const onFinishAddToCartForUser = (res, buyNow) => {
    let hasError = false;
    if (cartItems.length > 0) {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === res.id) {
          const newQuantity = item.quantity + res?.quantity;
          if (newQuantity > 3) {
            onOpenErrorNotify('Tối đa 3 số lượng cho mỗi sản phẩm');
            hasError = true;
            return item;
          }
          if (newQuantity > res?.stock) {
            onOpenErrorNotify('Số lượng trong giỏ đã vượt quá số lượng tồn kho');
            hasError = true;
            return item;
          }
          return { ...item, quantity: newQuantity, createdAt: new Date() };
        }
        return item;
      });

      const existingItem = cartItems.find(item => item.id === res.id);
      if (!existingItem) {
        updatedCartItems.push({ ...res, createdAt: new Date() });
      }
      sortByDate(updatedCartItems);
      localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    }
    else {
      const newCartItems = [];
      const cartItem = {
        ...res,
        createdAt: new Date(),
      }
      newCartItems.push(cartItem);
      localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(newCartItems));
      setCartItems(newCartItems);
    }
    if (!hasError) {
      onOpenSuccessNotify('Thêm vào giỏ hàng thành công');

      if (buyNow) {
        history.push(PATH_PAGE.cart.root);
      }
    }
  }

  const onFinishAddToCartForAccount = (res, buyNow) => {
    setCartItems(res);
    onOpenSuccessNotify('Thêm vào giỏ hàng thành công');
    if (buyNow) {
      history.push(PATH_PAGE.cart.root);
    }
  }

  const onFinishDeleteCartItemForAccount = (res, onCheckVoucher) => {
    const newCartItems = cartItems.filter((item) => item.cartDetailId !== res);
    setCartItems(newCartItems);

    const totalCart = newCartItems && newCartItems.reduce((total, item) => total + (item?.price * item?.quantity), 0);
    if (location.pathname === PATH_PAGE.cart.root) {
      onCheckVoucher?.(totalCart);
    }
  }

  const handleUpdateCart = (id, buyNow = false) => {
    if (!authUser) {
      fetch(CLIENT_API.product.details_size(id), null, (res) => onFinishAddToCartForUser(res, buyNow));
    }
    else {
      const body = {
        productItemId: id,
        accountId: authUser?.id,
      }
      post(CLIENT_API.cart.post, body, (res) => onFinishAddToCartForAccount(res, buyNow));
    }
  }

  const handleRemoveCartItem = (id, onCheckVoucher) => {
    if (!authUser) {
      const newCartItems = cartItems.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(newCartItems));
      setCartItems(newCartItems);

      const totalCart = newCartItems && newCartItems.reduce((total, item) => total + (item?.price * item?.quantity), 0);
      if (location.pathname === PATH_PAGE.cart.root) {
        onCheckVoucher?.(totalCart);
      }

    }
    else {
      remove(CLIENT_API.cart.delete(id), null, (res) => onFinishDeleteCartItemForAccount(res, onCheckVoucher));
    }

  }

  const onFinishUpdateCartItemSizeForAccount = (res) => {
    setCartItems(res);
    onOpenSuccessNotify('Cập nhật kích cỡ thành công');
  }

  const onFinishUpdateCartItemSizeForUser = (id, res) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...res, quantity: item?.quantity, createdAt: item?.createdAt };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(updatedCartItems));
    onOpenSuccessNotify('Cập nhật kích cỡ thành công');
  }

  const onFinishUpdateCartItemQuantityForAccount = (res, onCheckVoucher) => {
    setCartItems(res);
    const totalCart = res && res.reduce((total, item) => total + (item?.price * item?.quantity), 0);
    onCheckVoucher?.(totalCart);
    onOpenSuccessNotify('Cập nhật số lượng thành công');
  }

  const onFinishUpdateCartItemQuantityForUser = (id, quantity, res, onCheckVoucher) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...res, quantity, createdAt: item?.createdAt };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(updatedCartItems));
    const totalCart = updatedCartItems && updatedCartItems.reduce((total, item) => total + (item?.price * item?.quantity), 0);
    onCheckVoucher?.(totalCart);
    onOpenSuccessNotify('Cập nhật số lượng thành công');
  }

  const handleUpdateCartItemQuantity = (id, quantity, onCheckVoucher) => {
    if (authUser) {
      const body = {
        id,
        quantity: parseInt(quantity),
        accountId: authUser?.id,
      }
      console.log(body)
      put(CLIENT_API.cart.put_quantity, body, (res) => onFinishUpdateCartItemQuantityForAccount(res, (res) => onCheckVoucher(res)));
    }
    else {
      fetch(CLIENT_API.product.details_size(id), null, (res) => onFinishUpdateCartItemQuantityForUser(id, parseInt(quantity), res, (res) => onCheckVoucher(res)));
    }
  }

  const handleUpdateCartItemSize = (id, newProductItemId) => {
    if (authUser) {
      const body = {
        id,
        newProductItemId,
        accountId: authUser?.id,
      }
      put(CLIENT_API.cart.put, body, (res) => onFinishUpdateCartItemSizeForAccount(res));
    }
    else {
      fetch(CLIENT_API.product.details_size(newProductItemId), null, (res) => onFinishUpdateCartItemSizeForUser(id, res));
    }
  }

  const resetCart = () => {
    if (authUser) {
      setCartItems([]);
    }
    else {
      const cartItemsReset = [];
      setCartItems(cartItemsReset);
      localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_KEY, JSON.stringify(cartItemsReset));
    }
  }

  return (
    <UserContext.Provider
      value={{
        onUpdateCart: handleUpdateCart,
        onRemoveCartItem: handleRemoveCartItem,
        cartItems,
        onUpdateCartSize: handleUpdateCartItemSize,
        onUpdateCartQuantity: handleUpdateCartItemQuantity,
        totalCart: cartItems && cartItems.reduce((total, item) => total + (item?.price * item?.quantity), 0),
        resetCart,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext }

const sortByDate = (list) => {
  list.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
