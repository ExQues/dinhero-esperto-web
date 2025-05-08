
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      className="border-blue-200 dark:border-blue-800 bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-700" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300" />
      )}
    </Button>
  );
}
