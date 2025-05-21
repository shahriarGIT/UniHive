import { useEffect, useRef } from "react";

export const useOptionClose = ({ closeModal }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // contains is a DOM function that checks a given input is a children of that ref node
      if (modalRef?.current && !modalRef?.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [modalRef, closeModal]);

  return [modalRef];
};
