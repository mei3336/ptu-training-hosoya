import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div className="layout">
      <Header />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;