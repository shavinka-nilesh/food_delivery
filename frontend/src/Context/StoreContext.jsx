import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [socialLinks, setSocialLinks] = useState({ facebook: "", twitter: "", linkedin: "" });
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [searchTerm, setSearchTerm] = useState("");
    const currency = "$";
    const deliveryCharge = 5;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const fetchCategories = async () => {
        const response = await axios.get(url + "/api/category/list");
        if (response.data.success) {
            setCategories(response.data.data);
        }
    }

    const fetchBanners = async () => {
        const response = await axios.get(url + "/api/banner/list");
        if (response.data.success) {
            setBanners(response.data.data);
        }
    }

    const fetchSocialLinks = async () => {
        try {
            const response = await axios.get(`${url}/api/social/get`);
            if (response.data.success) {
                setSocialLinks(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching social links:", error);
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        // Setup Global Axios Interceptor for deleted user checks
        const interceptor = axios.interceptors.response.use(
            response => {
                // Check if the backend flagged this specific account as recently deleted
                if (response.data && response.data.accountDeleted === true) {
                    // Forcefully log them out locally
                    localStorage.removeItem("token");
                    setToken("");
                    setCartItems({});
                    toast.error(response.data.message || "Your account has been terminated.");
                }
                return response;
            },
            error => {
                return Promise.reject(error);
            }
        );

        async function loadData() {
            await fetchFoodList();
            await fetchCategories();
            await fetchBanners();
            await fetchSocialLinks();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [])

    const contextValue = {
        url,
        food_list,
        categories,
        banners,
        socialLinks,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        searchTerm,
        setSearchTerm,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;