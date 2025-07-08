import React, { useState, useEffect } from "react";
import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Nav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('🎨 Inicializando tema:', { savedTheme, systemPrefersDark });
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      console.log('🌙 Tema inicial: oscuro');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      console.log('☀️ Tema inicial: claro');
    }

    // Scroll handler
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('🌙 Modo oscuro activado');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('☀️ Modo claro activado');
    }
  };

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Navbar 
    className={`fixed w-full transition-all duration-300 ${
      isScrolled 
        ? 'z-50 py-1 bg-white dark:bg-black shadow-lg md:bg-white md:dark:bg-black' 
        : 'z-50 py-4 bg-white dark:bg-black md:bg-transparent md:dark:bg-transparent'
    }`}
      fluid
    >
      <Navbar.Brand href="/">
        <img 
          src="./assets/images/hacker.png" 
          className={`mr-3 transition-all duration-300 ${
            isScrolled ? 'h-5 sm:h-7' : 'h-6 sm:h-9'
          }`} 
          alt="Logo" 
        />
        <span className={`self-center whitespace-nowrap font-bold dark:text-white transition-all duration-300 ${
          isScrolled ? 'text-lg' : 'text-2xl'
        }`}>
          HAK3R
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
          aria-label="Toggle theme"
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
        </button>
        <a
        href="https://github.com/Dan-Duran/hak3r"
        target="_blank"
        rel="noopener noreferrer"
        className={`hidden md:flex mx-3 bg-gray-800 hover:bg-gray-900 py-2 px-4 transition-all duration-300 flex items-center gap-2 ${
          isScrolled ? 'scale-90' : 'scale-100'
        }`}
      >
        <svg 
          className="w-6 h-6 text-gray-100" 
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            fillRule="evenodd" 
            d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" 
            clipRule="evenodd"
          />
        </svg>
        <span className="text-white font-medium">FREE Download</span>
      </a>
        <button
          type="button"
          onClick={() => scrollToSection('contact')}
          className={`text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-bold text-center mx-3 md:mr-0 z-10 transition-all duration-300 ${
            isScrolled ? 'text-sm px-3 py-1.5' : 'text-md px-4 py-2'
          }`}
        >
          Contact Me!
        </button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {[
          { path: '/', label: 'Home' },
          { path: '/#about', label: 'About' },
          { path: '/#skills', label: 'Skills' },
          { path: '/#projects', label: 'Projects' },
          { path: '/cybersecurity-library', label: 'Biblioteca' },
          { path: '/#contact', label: 'Contact' }
        ].map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`block pr-4 pl-3 border-b border-gray-100 text-gray-700 hover:bg-gray-50 font-bold dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-green-700 md:dark:hover:bg-transparent md:dark:hover:text-white transition-all duration-300 ${
              isScrolled ? 'text-base text-3xl md:text-lg py-2' : 'text-3xl md:text-xl py-2.5'
            } ${location.pathname === item.path ? 'text-green-600 dark:text-green-400' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;