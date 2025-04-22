import { createContext, useContext, useState } from "react";
import { AppContext } from "./AppContext";
import { useNavigate } from 'react-router-dom'

export const StoreContext = createContext();

const StoreContextProvider = (props) => {

    const {token} = useContext(AppContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState({});
    const {items} = useContext(AppContext);

    const [orderItems, setOrderItems] = useState('');

    const addToCart = (itemId) => {
        if(!token){
            navigate('/auth');
            return;
        }
        if(!cartItems[itemId]){
            setCartItems((prev) => ({...prev, [itemId]:1}));
        } else{
            setCartItems((prev) => ({...prev, [itemId]:prev[itemId]+1}));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]-1}));
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = items.find((product)=>product.id === Number(item));
                totalAmount += itemInfo?.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const value  = {
        cartItems, setCartItems,
        addToCart, removeFromCart, getTotalCartAmount,
        orderItems, setOrderItems
    }

    return <StoreContext.Provider value={value}>
            {props.children}
    </StoreContext.Provider>
}

export default StoreContextProvider