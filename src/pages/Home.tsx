import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "/public/assets/css/particles.css";

const Home: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Construyendo mi futuro en la ciberseguridad";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <>
      <Nav />
      <main id="home" className="w-full">
        {/* Floating light elements contained within the hero section */} 
        <div className="light x1"></div>
        <div className="light x2"></div>
        <div className="light x3"></div>
        <div className="light x4"></div>
        <div className="light x5"></div>
        <div className="light x6"></div>
        <div className="light x7"></div>
        <div className="light x8"></div>
        <div className="light x9"></div>
      
        {/* #### HERO SECTION #### */}
        <section className="pt-20 md:pt-0 bg-white dark:bg-black">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-32 lg:grid-cols-12 relative z-10">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1
                id="dynamicHeadline"
                className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
              >
                {typedText}
                <span className="animate-pulse">|</span>
              </h1>

              <p className="max-w-2xl mb-6 font-bold text-gray-500 lg:mb-8 text-3xl dark:text-gray-400">
                Apasionado estudiante de ciberseguridad explorando el mundo del hacking ético, análisis de vulnerabilidades y protección de sistemas. En constante aprendizaje y desarrollo de habilidades técnicas.
              </p>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text:3xl text-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Sobre Mí
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <Link
                to="/cybersecurity-library"
                className="inline-flex items-center justify-center px-5 py-4 text-base font-medium text:3xl text-center text-gray-900 border-4 border-blue-300 hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-blue-700 dark:hover:bg-blue-700 dark:focus:ring-gray-800"
              >
                Biblioteca de Ciberseguridad
              </Link>
            </div>
            <div 
              id="hacker-logo" 
              className="lg:mt-0 lg:col-span-5 lg:flex relative z-10"
              style={{ opacity: 0 }}
            >
              <img
                src="./assets/images/hacker.png"
                alt="hacker"
              />
            </div>
          </div>
        </section>

        {/* #### SOBRE MÍ SECTION #### */}
        <section id="about" className="bg-white dark:bg-black pt-8">
          <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-8 lg:px-6">
            <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
              <h2 className="mb-4 text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Sobre Mí
              </h2>
              <p className="mb-4 text-3xl">
                Soy un estudiante apasionado por la ciberseguridad, enfocado en el hacking ético y la protección de sistemas informáticos. Mi interés comenzó con la curiosidad por entender cómo funcionan los sistemas y cómo protegerlos.
              </p>
              <p className="text-xl">
                Actualmente estoy formándome en diferentes áreas de la seguridad informática, desde análisis de vulnerabilidades hasta forense digital, siempre con el objetivo de contribuir a un entorno digital más seguro.
              </p>
              <p className="text-xl mt-4">
                Mi meta es convertirme en un profesional de la ciberseguridad que pueda ayudar a organizaciones a proteger sus activos digitales y a crear un mundo más seguro.
              </p>
              <a href="#" className="inline-flex mt-8 items-center justify-center px-5 py-4 text-base font-medium text:3xl text-center text-gray-900 border-4 border-green-300 hover:bg-green-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-green-700 dark:hover:bg-green-700 dark:focus:ring-gray-800">
                Descargar CV
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <img
                className="w-full transition-all duration-300 hover:saturate-150 hover:brightness-75 hover:hue-rotate-15"
                src="./assets/images/office-long-2.png"
                alt="office content 1"
              />
              <img
                className="mt-4 w-full lg:mt-10 transition-all duration-300 hover:saturate-150 hover:brightness-75 hover:hue-rotate-15"
                src="./assets/images/office-long-1.png"
                alt="office content 2"
              />
            </div>
          </div>
        </section>

        {/* #### HABILIDADES SECTION #### */}
        <section id="skills" className="pt-8 pb-12 bg-white dark:bg-black flex justify-center items-center">
          <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 text-center">
            <div className="max-w-screen-md mb-8 lg:mb-12 mx-auto">
              <h2 className="mb-4 text-4xl md:text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Mis Habilidades Técnicas
              </h2>
              <p className="text-gray-500 text-2xl dark:text-gray-400">
                Conocimientos y herramientas que estoy desarrollando en mi formación en ciberseguridad.
              </p>
            </div>

            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
              <div className="transform transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mx-auto items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-green-500 group-hover:scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z"/>
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-bold dark:text-white">Lenguajes de Programación</h3>
                <p className="text-gray-500 text-xl dark:text-gray-400">
                  Python, Bash, SQL, JavaScript, HTML/CSS. Enfocado en scripts de automatización y análisis de seguridad.
                </p>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mx-auto items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-green-500 group-hover:scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 15v3c0 .5523.44772 1 1 1h8v-8m-9 4v-4m0 4h9m-9-4V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 11h11m6.25 5c0 1.2426-1.0073 2.25-2.25 2.25M20.25 16c0-1.2426-1.0073-2.25-2.25-2.25M20.25 16H21m-3 2.25c-1.2426 0-2.25-1.0074-2.25-2.25M18 18.25V19m-2.25-3c0-1.2426 1.0074-2.25 2.25-2.25M15.75 16H15m3-2.25V13m-1.591 1.409-.5303-.5303m4.2426 4.2426-.5303-.5303m-3.182 0-.5303.5303m4.2426-4.2426-.5303.5303"/>
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-bold dark:text-white">Herramientas de Seguridad</h3>
                <p className="text-gray-500 text-xl dark:text-gray-400">
                  Wireshark, Metasploit, Burp Suite, Nmap, Kali Linux, OWASP ZAP, y otras herramientas de pentesting.
                </p>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mx-auto items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-green-500 group-hover:scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"/>
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-bold dark:text-white">Sistemas Operativos</h3>
                <p className="text-gray-500 text-xl dark:text-gray-400">
                  Linux (Kali, Ubuntu, CentOS), Windows, macOS. Experiencia en administración y hardening de sistemas.
                </p>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mx-auto items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-green-500 group-hover:scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M14.7141 15h4.268c.4043 0 .732-.3838.732-.8571V3.85714c0-.47338-.3277-.85714-.732-.85714H6.71411c-.55228 0-1 .44772-1 1v4m10.99999 7v-3h3v3h-3Zm-3 6H6.71411c-.55228 0-1-.4477-1-1 0-1.6569 1.34315-3 3-3h2.99999c1.6569 0 3 1.3431 3 3 0 .5523-.4477 1-1 1Zm-1-9.5c0 1.3807-1.1193 2.5-2.5 2.5s-2.49999-1.1193-2.49999-2.5S8.8334 9 10.2141 9s2.5 1.1193 2.5 2.5Z"/>
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-bold dark:text-white">Redes y Protocolos</h3>
                <p className="text-gray-500 text-xl dark:text-gray-400">
                  TCP/IP, DNS, HTTP/HTTPS, SSH, VPN, análisis de tráfico de red y configuración de firewalls.
                </p>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mx-auto items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-green-500 group-hover:scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 5 9 4V3m5 2 1-1V3m-3 6v11m0-11a5 5 0 0 1 5 5m-5-5a5 5 0 0 0-5 5m5-5a4.959 4.959 0 0 1 2.973 1H15V8a3 3 0 0 0-6 0v2h.027A4.959 4.959 0 0 1 12 9Zm-5 5H5m2 0v2a5 5 0 0 0 10 0v-2m2.025 0H17m-9.975 4H6a1 1 0 0 0-1 1v2m12-3h1.025a1 1 0 0 1 1 1v2M16 11h1a1 1 0 0 0 1-1V8m-9.975 3H7a1 1 0 0 1-1-1V8"/>
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-bold dark:text-white">Criptografía</h3>
                <p className="text-gray-500 text-xl dark:text-gray-400">
                  Conceptos básicos de criptografía, algoritmos de hash, cifrado simétrico y asimétrico, certificados SSL/TLS.
                </p>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group">
                <div className="flex justify-center mx-auto items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-green-500 group-hover:scale-125" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z"/>
                  </svg>
                </div>
                <h3 className="mb-2 text-3xl font-bold dark:text-white">Certificaciones</h3>
                <p className="text-gray-500 text-xl dark:text-gray-400">
                  En proceso de obtención de certificaciones como CompTIA Security+, CEH, y otras relevantes en el campo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* #### PROYECTOS SECTION #### */}
        <section id="projects" className="bg-gray-100 dark:bg-gray-900 py-8">
          <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div className="max-w-screen-md mb-8 lg:mb-12 mx-auto text-center">
              <h2 className="mb-4 text-4xl md:text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Mis Proyectos
              </h2>
              <p className="text-gray-500 text-2xl dark:text-gray-400">
                Proyectos personales, laboratorios y prácticas que he desarrollado durante mi formación.
              </p>
            </div>

            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
              <div className="transform transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="mb-2 text-2xl font-bold dark:text-white">Análisis de Vulnerabilidades Web</h3>
                <p className="text-gray-500 text-lg dark:text-gray-400 mb-4">
                  Proyecto de análisis de vulnerabilidades en aplicaciones web usando OWASP Top 10 como guía.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">OWASP ZAP</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Burp Suite</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">SQL Injection</span>
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="mb-2 text-2xl font-bold dark:text-white">Script de Análisis de Red</h3>
                <p className="text-gray-500 text-lg dark:text-gray-400 mb-4">
                  Script en Python para automatizar el escaneo de puertos y detección de servicios en red.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Python</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Nmap</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Networking</span>
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="mb-2 text-2xl font-bold dark:text-white">CTF - Capture The Flag</h3>
                <p className="text-gray-500 text-lg dark:text-gray-400 mb-4">
                  Participación en competencias CTF, resolviendo desafíos de criptografía, forense y explotación.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Criptografía</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Forense</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Explotación</span>
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="mb-2 text-2xl font-bold dark:text-white">Laboratorio de Pentesting</h3>
                <p className="text-gray-500 text-lg dark:text-gray-400 mb-4">
                  Configuración y uso de laboratorios virtuales para prácticas de penetración ética.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Kali Linux</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Metasploit</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">VirtualBox</span>
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="mb-2 text-2xl font-bold dark:text-white">Análisis de Malware</h3>
                <p className="text-gray-500 text-lg dark:text-gray-400 mb-4">
                  Proyecto de análisis estático y dinámico de muestras de malware en entorno controlado.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Cuckoo Sandbox</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">IDA Pro</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Análisis Dinámico</span>
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:scale-105 group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="mb-2 text-2xl font-bold dark:text-white">Blog de Seguridad</h3>
                <p className="text-gray-500 text-lg dark:text-gray-400 mb-4">
                  Blog personal donde comparto conocimientos sobre ciberseguridad y análisis de vulnerabilidades.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">WordPress</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Tutoriales</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Análisis</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* #### CONTACT SECTION #### */}
        <section id="contact" className="bg-white dark:bg-black transition-all duration-300 hover:scale-105">
          <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
              ¡Conectemos!
            </h2>
            <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 text-xl lg:text-2xl">
              ¿Interesado en colaborar, compartir conocimientos o simplemente charlar sobre ciberseguridad? ¡Me encantaría conectar contigo!
            </p>
            <form action="#" className="space-y-8">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Tu nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-sm bg-gray-50 border-4 border-green-300 text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-black dark:border-green-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Tu email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow-sm bg-gray-50 border-4 border-green-300 text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-black dark:border-green-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  className="block p-3 w-full text-sm text-gray-900 bg-gray-50 border-4 border-green-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-black dark:border-green-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  placeholder="¿En qué puedo ayudarte?"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Tu mensaje
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 shadow-sm border-4 border-green-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-black dark:border-green-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="py-3 px-5 text-lx font-medium text-center text-white bg-green-600 hover:bg-green-700 border-2 border-green-600 rounded-none sm:w-fit focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-600 dark:focus:ring-green-800"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home; 