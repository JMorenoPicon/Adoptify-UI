import { Provider } from "@/components/ui/provider.tsx"
import { createRoot } from 'react-dom/client'
/* Slick Carousel CSS */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import App from './App.tsx'
import './App.css';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>,
)
