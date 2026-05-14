// import { Outlet } from "react-router-dom";
// import Footer from "../../component/footer";
// import Header from "../../component/header";
// // import Header from "../../component/header";
// // import Footer from "../../component/footer";

// function CommonLayout() {
//   return (
//     <div>
//       <Header/>
//       <Outlet />
//       <Footer />
//     </div>
//   );
// }

// export default CommonLayout;

import { Outlet, useLocation } from "react-router-dom";
import Footer from "../../component/footer";
import Header from "../../component/header";
import "./common-layout.css"; // 👈 Make sure to create this file

function CommonLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default CommonLayout;
