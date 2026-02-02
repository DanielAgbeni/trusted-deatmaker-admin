export default function ContactForm() {
  return (
    <form className="flex-1 ">
      <div>
        <p className="text-lg font-semibold">Leave us a message</p>
      </div>

      <label
        htmlFor="FullName"
        className="relative my-4 block rounded-sm border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="text"
          id="FullName"
          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-hidden focus:ring-0"
          placeholder="Full Name"
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Full Name
        </span>
      </label>

      <label
        htmlFor="Email"
        className="relative my-4 block rounded-sm border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="text"
          id="Email"
          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-hidden focus:ring-0"
          placeholder="Email"
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Email
        </span>
      </label>

      <div className="my-4">
        <div className="overflow-hidden rounded-sm border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
          <textarea
            id="OrderNotes"
            className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
            rows={6}
            placeholder="Your Message ..."
          ></textarea>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-block text-white rounded-sm btn-primary mt-4"
      >
        block
      </button>
    </form>
  );
}
