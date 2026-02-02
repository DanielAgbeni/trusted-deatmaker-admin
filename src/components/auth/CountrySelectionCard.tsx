"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaGlobe, FaLock } from "react-icons/fa";
import { LiaArrowRightSolid } from "react-icons/lia";
import { useGetCountriesQuery } from "@/lib/store/apis";

interface CountrySelectionCardProps {
  onCountrySelect: (countryCode: string) => void;
  selectedCountry: string;
  onContinue: () => void;
}

export default function CountrySelectionCard({
  onCountrySelect,
  selectedCountry,
  onContinue,
}: CountrySelectionCardProps) {
  const { data: countriesData, isLoading, isError, refetch } = useGetCountriesQuery();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countriesData?.data?.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.isoCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountryData = countriesData?.data?.find(
    (country) => country.isoCode === selectedCountry
  );

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 py-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading countries...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 py-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaGlobe className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Unable to load countries</h3>
          <p className="text-gray-600">Please check your connection and try again</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 py-8">
      {/* Currency Warning Banner */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-amber-900 mb-1">Important Currency Notice</h3>
            <p className="text-xs text-amber-800">
              Your account currency will be automatically set to the currency of your selected country. 
              <span className="font-semibold"> This cannot be changed later.</span>
            </p>
            {selectedCountryData && (
              <div className="mt-2 p-2 bg-white rounded border border-amber-300">
                <p className="text-xs font-medium text-amber-900">
                  You will receive: <span className="font-bold">{selectedCountryData.currencyCode} ({selectedCountryData.currencySymbol})</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* Country Dropdown */}
      <div className="relative mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Country <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-500">(Currency auto-selected)</span>
        </label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-between hover:border-blue-400 transition-colors shadow-sm"
        >
          <div className="flex items-center space-x-3">
            {selectedCountryData ? (
              <>
                <div className="w-10 h-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded flex items-center justify-center text-sm font-bold">
                  {selectedCountryData.isoCode}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{selectedCountryData.name}</p>
                  <p className="text-sm">
                    <span className="text-gray-600">Currency:</span>{' '}
                    <span className="font-bold text-blue-700">
                      {selectedCountryData.currencyCode} {selectedCountryData.currencySymbol}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <FaGlobe className="text-gray-400" />
                <span>Click to choose country & currency</span>
              </div>
            )}
          </div>
          {isDropdownOpen ? (
            <FaChevronUp className="text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
            {/* Search Input */}
            <div className="sticky top-0 bg-white p-3 border-b">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-500">
                Showing {filteredCountries?.length || 0} countries
              </div>
            </div>

            {/* Country List */}
            <div className="py-2">
              {filteredCountries?.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No countries found matching "{searchTerm}"
                </div>
              ) : (
                filteredCountries?.map((country) => (
                  <button
                    key={country.isoCode}
                    type="button"
                    onClick={() => {
                      onCountrySelect(country.isoCode);
                      setIsDropdownOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedCountry === country.isoCode ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-8 rounded flex items-center justify-center text-sm font-medium ${
                        selectedCountry === country.isoCode 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'bg-gray-100 border border-gray-200'
                      }`}>
                        {country.isoCode}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{country.name}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Currency:</span>
                          <span className={`font-semibold ${
                            selectedCountry === country.isoCode ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {country.currencyCode}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            selectedCountry === country.isoCode 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {country.currencySymbol}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedCountry === country.isoCode && (
                      <div className="flex items-center text-blue-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={onContinue}
        disabled={!selectedCountry}
        className={`w-full py-3.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-3 shadow-sm ${
          selectedCountry
            ? 'bg-[#0097C7] text-white hover:bg-[#046f90] transform hover:-translate-y-0.5'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {selectedCountry ? (
          <>
            <span>Continue to Sign Up</span>
            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded">
              <span className="text-sm">{selectedCountryData?.currencySymbol}</span>
              <LiaArrowRightSolid className="text-lg" />
            </div>
          </>
        ) : (
          <span>Select a country to continue</span>
        )}
      </button>
    </div>
  );
}