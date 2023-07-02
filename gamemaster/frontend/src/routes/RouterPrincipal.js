import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { FooterComponent } from '../Components/FooterComponent';
import { HomeComponent } from '../Components/HomeComponent';
import { NavbarComponent } from '../Components/NavbarComponent';
import { HeaderComponent } from '../Components/HeaderComponent';
import { AboutUsComponent } from '../Components/AboutUsComponent';
import { AddArticleComponent } from '../Components/AddArticleComponent';
import { ArticleComponent } from '../Components/ArticleComponent';
import { CambioExitoso } from '../Components/CambioExitoso';

const RouterPrincipal = () => {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/add" element={<AddArticleComponent />} />
        <Route path="/about" element={<AboutUsComponent />} />
        <Route path="/article/:id" element={<ArticleComponent />} />
        <Route path="/cambio-exitoso/:id" element={<CambioExitoso />} />
      </Routes>

      <FooterComponent />
    </BrowserRouter>
  );
};

export default RouterPrincipal;
