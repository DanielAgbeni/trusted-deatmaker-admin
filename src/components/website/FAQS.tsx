export default function FAQs() {
  return (
    <section className="my-2">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h2
          className=" 
            mx-auto           
              py-2
              text-2xl
              sm:text-4xl
              sm:max-w-[750px]
              text-(--foreground_dark_blue)
              text-center
              font-extralight 
              capitalize"
        >
          Frequently Asked Questions (FAQs)
        </h2>
        <div className="w-full max-w-4xl divide-y divide-(--foreground_neutral_base) mx-auto px-2 my-4">
          <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="">What is TrustedDealMaker?</h3>
              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
              </span>
            </summary>

            <p className="mt-4 leading-relaxed text-gray-700 text-sm">
              TrustedealMaker provides an excellent ecosystem where any two
              trading parties (buyer and seller) can agree on business deals and
              are bound to operate within the agreement. THis allows each party
              to experience 100% guarantees that they would not lose their money
              or be denied their services or purchases.
            </p>
          </details>

          <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="">
                What is the revenue How safe is TrustedDealMaker?
              </h3>
              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
              </span>
            </summary>

            <p className="mt-4 leading-relaxed text-gray-700 text-sm">
              Trusteddealmaker is 10% safe It provides 100% no-funds-loss or
              service delivery guarantee for each party in a transaction or
              trade. It enforces the performance of a trade according to terms
              agreed by both parties.
            </p>
          </details>
          <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="">How can i get started?</h3>
              <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
              </span>
            </summary>

            <p className="mt-4 leading-relaxed text-gray-700 text-sm">
              By downloading the app from the google or IOS app stores you can
              start your journey to safe trading and guaranteed transactions
              with any seller or buyer anywhere. The app is very intuitive and
              self explanatory.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
