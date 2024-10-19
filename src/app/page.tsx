"use client";

import { useEffect, useState } from "react";

// Define types for Ads data
type Ad = {
  id: string;
  description: string;
  video_link: string;
  image_link: string;
  URL: string;  // Ensure it matches Supabase exactly if the column is uppercase
  CTA: string;  // Same as above
  Start_Date: string;  // Same as above
  tag: string;
  created_at: string;  // New column for created_at
};

export default function AdsDataPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [selectedCTA, setSelectedCTA] = useState<string>("ALL");
  const [isCTADropdownOpen, setIsCTADropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Maximum ads per page

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/api/fetchallAds"); // Ensure this is the correct path
        const data = await response.json();
  
        if (response.ok) {
          const normalizedData = data.map((ad: any) => ({
            id: ad.id,
            description: ad.description,
            video_link: ad.video_link || "N/A",
            image_link: ad.image_link || "N/A",
            URL: ad.URL || "N/A",  // Matches Supabase column name exactly
            CTA: ad.CTA || "N/A",  // Matches Supabase column name exactly
            Start_Date: ad.Start_Date || "N/A",  // Matches Supabase column name exactly
            tag: ad.tag || "other",
            created_at: ad.created_at || "N/A"  // Include created_at
          }));
  
          // Sort ads by created_at in descending order
          const sortedAds = normalizedData.sort((a: Ad, b: Ad) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
          setAds(sortedAds);
          setFilteredAds(sortedAds); // Initially show all ads
  
          // Add console log after data is fetched and set
          console.log("Fetch of latest 1000 ads just completed");
        } else {
          console.error("Error fetching ads:", data.error);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
  
    fetchAds();
  }, []);
  

  // Filter ads as the selected CTA changes
  useEffect(() => {
    const filtered = ads.filter((ad) => selectedCTA === "ALL" || ad.CTA === selectedCTA);
    setFilteredAds(filtered);
    setCurrentPage(1); // Reset to the first page when the filter changes
  }, [selectedCTA, ads]);


  useEffect(() => {
  const filtered = ads.filter((ad) => {
    const matchesCTA = selectedCTA === "ALL" || ad.CTA === selectedCTA;
    const matchesSearchTerm = searchTerm === "" || ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCTA && matchesSearchTerm;
  });

  setFilteredAds(filtered);
  setCurrentPage(1); // Reset to the first page when the filter changes
}, [selectedCTA, searchTerm, ads]);


  // Pagination controls
  const totalPages = Math.ceil(filteredAds.length / pageSize);
  const currentPageData = filteredAds.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
 // Function to clean and re-encode the corrupted data
 const cleanCorruptedText = (text: string) => {
  try {
    // Step 1: Attempt to fix encoding issues (like MÃ©decins)
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);  // Re-encode text to fix encoding issues
    const decodedText = new TextDecoder('utf-8').decode(encodedText);  // Decode the re-encoded text

    // Step 2: Fix emojis or other special characters using decodeURIComponent
    return decodeURIComponent(escape(decodedText));
  } catch (e) {
    // If it fails, return the original text
    return text;
  }
};

  // Get unique CTAs for dropdown
  const uniqueCTAs = Array.from(new Set(ads.map(ad => ad.CTA)));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-4 flex flex-col">
        <nav className="space-y-2 text-gray-600">
          <a href="/" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200">
            <span className="text-gray-400">📦</span>
            <span className="font-medium">Ads Data</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-4xl font-bold text-black">ADS</h1>
          </div>

          {/* Search Bar */}
<div className="relative mb-4 inline-block w-full">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by description..."
    className="w-full rounded-md border-gray-200 py-2 px-4 text-gray-900 shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
  />
</div>


          {/* Dropdown for CTA Filter */}
          <div className="relative mb-4 inline-block">
            <div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
              <button
                className="border-e px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setIsCTADropdownOpen(!isCTADropdownOpen)}
              >
                {selectedCTA}
              </button>

              <button className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700">
                <span className="sr-only">Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {isCTADropdownOpen && (
              <div
                className="absolute z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
                role="menu"
              >
                <div className="p-2">
                  {["ALL", ...uniqueCTAs].map(cta => (
                    <button
                      key={cta}
                      onClick={() => {
                        setSelectedCTA(cta);
                        setCurrentPage(1);
                        setIsCTADropdownOpen(false);
                      }}
                      className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      role="menuitem"
                    >
                      {cta}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          

          {/* Ads Table */}
          <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-left ">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Created At</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Description</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Video Link</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Image Link</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">URL</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CTA</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Start Date</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPageData.length > 0 ? (
                    currentPageData.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-100">
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {new Date(ad.created_at).toLocaleString()} {/* Format the created_at date */}
                        </td>
                        <td className="whitespace-normal px-4 py-2 text-gray-900 overflow-hidden" 
    style={{ 
      display: '-webkit-box', 
      WebkitLineClamp: 3, 
      WebkitBoxOrient: 'vertical',
      minWidth: '300px',  // Adjust the minimum width as needed
      maxWidth: '600px',  // Set a maximum width to prevent excessive stretching
    }}>
  {cleanCorruptedText(ad.description.length > 50 ? `${cleanCorruptedText(ad.description.slice(0, 150))}...` : cleanCorruptedText(ad.description))}
</td>





                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {ad.video_link !== "N/A" ? (
                            <video width="100" controls>
                              <source src={ad.video_link} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {ad.image_link !== "N/A" ? (
                            <img src={ad.image_link} alt="Ad Thumbnail" width="100" className="rounded-md" />
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
  {ad.URL ? (
    <a href={ad.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      {ad.URL.length > 30 ? `${ad.URL.slice(0, 30)}...` : ad.URL}
    </a>
  ) : (
    "N/A"
  )}
</td>

                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{ad.CTA}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{ad.Start_Date}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{ad.tag}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-gray-500">No ads available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${currentPage === 1 ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'} `}
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${currentPage === totalPages ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'} `}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
