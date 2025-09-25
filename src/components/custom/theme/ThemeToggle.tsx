import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export function ThemeToggle() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    // get click position relative to viewport
    const button = btnRef.current;
    let x = "50%";
    let y = "50%";

    if (button) {
      const rect = button.getBoundingClientRect();
      x = `${rect.left + rect.width / 2}px`;
      y = `${rect.top + rect.height / 2}px`;
      document.documentElement.style.setProperty("--circle-x", x);
      document.documentElement.style.setProperty("--circle-y", y);
    }

    if ((document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        document.documentElement.classList.toggle("dark", nextIsDark);
      });
    } else {
      document.documentElement.classList.toggle("dark", nextIsDark);
    }

    setIsDark(nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
  };

  // On mount: respect saved preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  return (
    <Button
      ref={btnRef}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
