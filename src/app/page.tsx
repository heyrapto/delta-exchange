import { Header } from "@/components/layout/header";
import { Banner } from "@/components/ui/banner";

export default function Home() {
  return (
    <div className="mx-auto md:max-w-full lg:max-w-[90%]">
      <Banner />
      <Header />
    </div>
  );
}
