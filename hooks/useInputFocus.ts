import type { FocusEvent as ReactFocusEvent } from "react";

/**
 * A simple hook to provide a consistent "scroll to center" behavior for form inputs.
 * This improves user experience, especially on mobile devices where the on-screen keyboard
 * can obscure the focused element.
 */
export const useInputFocus = () => {
  const handleFocus = (
    e: ReactFocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const target = e.target;

    if (target) {
      // Small delay to allow the keyboard to appear on mobile before scrolling
      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  };

  return { handleFocus };
};
