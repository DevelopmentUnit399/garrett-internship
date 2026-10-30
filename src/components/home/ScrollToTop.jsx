import { useEffect, useRef } from "react";
import AOS from "aos";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const isInitialMount = useRef(true);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    useEffect(() => {
        AOS.refreshHard();

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }, [pathname]);

    return null;
}
