import { Exchange } from "@/components/exchange";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Banner } from "@/components/ui/banner";

export default function Home() {
  return (
    <div className="relative mx-auto w-full xl:max-w-[120rem] min-h-screen">
      <Banner />
      <Header />
      <Exchange />
      <Footer />
    </div>
  );
}
