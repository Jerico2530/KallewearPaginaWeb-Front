import { useEffect, useState } from "react";

export const useNavbarHeight = (navbarRef) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!navbarRef?.current) return;

    const updateHeight = () => {
      setHeight(navbarRef.current.offsetHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [navbarRef]);

  return height;
};
