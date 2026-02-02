import ProductList from "@/components/website/explore/ProductList";
import FilterMenu from "@/components/website/explore/FilterMenu";
import SearchBarFIlter from "@/components/website/explore/SearchBarFIlter";

export default function ExlorePage() {
  return (
    <main>
      <div className="drawer">
        <input id="productFilter" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content w-full max-w-7xl mx-auto py-8 px-4">
          <div className="flex gap-8 lg:my-6 mb-6">
            <div className="hidden lg:flex flex-1 max-w-xs ">
              <FilterMenu />
            </div>
            <div className="flex-1">
              <SearchBarFIlter />
              <ProductList />
            </div>
          </div>
        </div>
        <div className="drawer-side z-20 lg:hidden">
          <label
            htmlFor="productFilter"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <FilterMenu />
        </div>
      </div>
    </main>
  );
}
