/* ** LIBRARY(s) ** */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

/* ** ADDTIONAL IMPORT(s) ** */
import GET from '../../../../lib/related.js';
import ProductCard from './ProductCard.jsx';
import Carousel from './Carousel.jsx';
import YourOutfitList from './YourOutfitList.jsx';
import RelatedStyles from '../../styles/relatedProducts.css';

const RelatedProduct = ({ featuredProduct, setFeaturedProduct }) => {

  /* ** COMPONENT VARIABLE(s) ** */
  let localStorage = window.localStorage;

  /* ** STATE(s) ** */
  const [relatedProducts, setRelatedProducts] = useState([]); // Array
  const [relatedProductList, setRelatedProductList] = useState([]); // Array of Objects
  const [outfitList, setOutfitList] = useState(JSON.parse(localStorage.getItem('myOutfit')) || []); // Array
  const [yourOutfitList, setYourOutfitList] = useState([]); // Array of Objects

  /* ** ADDTIONAL FUNCTION(s) ** */
  const getRelatedProductsList = (array, type) => {
    array.length && type === 'related' ? setRelatedProductList([]) : null;
    array.forEach(productId => {
      axios.all([GET.featuredProduct(productId), GET.productStyles(productId), GET.productReviews(productId)])
        .then(axios.spread((...res) => {
          type === 'related' ? setRelatedProductList(relatedProductList => [...relatedProductList, { 'details': res[0].data, 'styles': res[1].data, 'reviews': res[2].data }]) : setYourOutfitList(prev => [...prev, { 'details': res[0].data, 'styles': res[1].data, 'reviews': res[2].data }]);
        }));
    });
  };

  const changeFeaturedProduct = (productId) => {
    GET.featuredProduct(productId)
      .then(res => {
        setFeaturedProduct(res.data);
      });
  };

  const handleAddToOutfit = () => {
    !outfitList.includes(featuredProduct.id) ? setOutfitList(prev => [...prev, featuredProduct.id]) : null;
  };

  const removeOutfit = (productId) => {
    setYourOutfitList(yourOutfitList.filter(outfit => outfit.details.id !== productId));
    setOutfitList(outfitList.filter(id => id !== productId));
    let updateStorage = JSON.parse(localStorage.getItem('myOutfit')).filter(id => id !== productId);
    localStorage.setItem('myOutfit', JSON.stringify(updateStorage));
  };

  /* ** USE EFFECT CALLS ** */
  useEffect(() => {
    GET.relatedProducts(featuredProduct.id)
      .then(res => {
        setRelatedProducts(res.data);
      });
  }, [featuredProduct]);

  useEffect(() => {
    getRelatedProductsList(relatedProducts, 'related');
  }, [relatedProducts]);

  useEffect(() => {
    let currentOutfitIds = [];
    yourOutfitList.forEach(product => currentOutfitIds.push(product.details.id));
    let newOutfit = outfitList.filter(id => !currentOutfitIds.includes(id));
    getRelatedProductsList(newOutfit, 'outfit');
    localStorage.setItem('myOutfit', JSON.stringify(outfitList));
  }, [outfitList]);


  return (
    <div className={'related-container'}>
      <div className={'related'}><h2 className={'title'}>RELATED PRODUCTS</h2></div>
      <Carousel
        relatedProductList={relatedProductList}
        changeFeaturedProduct={changeFeaturedProduct}
        featuredProduct={featuredProduct} />
      <div className={'outfit'}><h2 className={'title'}>YOUR OUTFIT</h2></div>
      <YourOutfitList
        handleAddToOutfit={handleAddToOutfit}
        yourOutfitList={yourOutfitList}
        setOutfitList={setOutfitList}
        outfitList={outfitList}
        removeOutfit={removeOutfit} />
    </div>
  );
};

export default RelatedProduct;