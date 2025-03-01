// ReactHelmetAsync 用於設定網頁 title
// 套件連結 : https://www.npmjs.com/package/react-helmet-async

import { Helmet, HelmetProvider } from 'react-helmet-async';

const ReactHelmetAsync = ({title="請設定 title"}) => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title} | Week06_React冬季限定本鋪 ( 2024.11 - 2025.03 ) </title>
        </Helmet>
      </HelmetProvider>
    </>
  );
};

export default ReactHelmetAsync;