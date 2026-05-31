import { ComponentProps } from "@/interfaces";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
