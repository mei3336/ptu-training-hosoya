import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div className="layout">

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;