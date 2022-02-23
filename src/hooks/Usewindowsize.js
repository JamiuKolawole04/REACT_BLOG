import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const [widowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });

    // run at load time
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return widowSize;

}

export default useWindowSize;