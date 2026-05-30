import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useTheme = () => {
  const location = useLocation();

  useEffect(() => {
    // Clear existing themes
    document.body.classList.remove('theme-ideastream', 'theme-cultivate', 'theme-digitalfrontier', 'theme-fastlane', 'theme-launchpad', 'theme-lifescience', 'theme-playlab', 'theme-tangibletech', 'theme-urbancore');

    // Apply specific community themes based on route
    if (location.pathname.startsWith('/feed/cultivate')) {
      document.body.classList.add('theme-cultivate');
    } else if (location.pathname.startsWith('/feed/digitalfrontier')) {
      document.body.classList.add('theme-digitalfrontier');
    } else if (location.pathname.startsWith('/feed/fastlane')) {
      document.body.classList.add('theme-fastlane');
    } else if (location.pathname.startsWith('/feed/launchpad')) {
      document.body.classList.add('theme-launchpad');
    } else if (location.pathname.startsWith('/feed/lifescience')) {
      document.body.classList.add('theme-lifescience');
    } else if (location.pathname.startsWith('/feed/playlab')) {
      document.body.classList.add('theme-playlab');
    } else if (location.pathname.startsWith('/feed/tangibletech')) {
      document.body.classList.add('theme-tangibletech');
    } else if (location.pathname.startsWith('/feed/urbancore')) {
      document.body.classList.add('theme-urbancore');
    } else {
      document.body.classList.add('theme-ideastream');
    }
  }, [location.pathname]);
};

export default useTheme;
