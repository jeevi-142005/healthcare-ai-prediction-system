import { useState } from 'react';
import { ThemeToggle } from '../theme-toggle'

export default function ThemeToggleExample() {
  const [darkMode, setDarkMode] = useState(false);
  return <ThemeToggle darkMode={darkMode} onToggle={setDarkMode} />
}
