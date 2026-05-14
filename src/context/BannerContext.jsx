import { createContext, useContext, useState } from 'react';

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDescription,setbannerDescription]= useState('')
  const [bannerDescription2, setbannerDescription2] = useState('')
  const [bannerDescription3, setbannerDescription3] = useState('')
  const [bannerDescription4, setbannerDescription4] = useState('')

  const [breadcrumb, setBreadcrumb] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  return (
    <BannerContext.Provider value={{ bannerTitle, setbannerDescription, bannerDescription, setBannerTitle, breadcrumb, setBreadcrumb, bannerImage, setBannerImage, bannerDescription2,setbannerDescription2,bannerDescription3,setbannerDescription3,bannerDescription4,setbannerDescription4 }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => useContext(BannerContext);
