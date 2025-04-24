import React, { useState, useEffect } from 'react';

export default function FilterModal({ onClose }) {
  const minGlobal = 0;
  const maxGlobal = 22000;
  const histogramData = [4, 7, 6, 9, 5, 8, 6, 10, 8, 6, 5, 9, 4, 7, 6, 8, 5, 10, 6, 6, 4];
  const step = (maxGlobal - minGlobal) / histogramData.length;

  const barRanges = histogramData.map((_, idx) => {
    const start = minGlobal + idx * step;
    const end = idx === histogramData.length - 1 ? maxGlobal : minGlobal + (idx + 1) * step;
    return [start, end];
  });

  const [priceRange, setPriceRange] = useState([minGlobal, maxGlobal]);
  const [saleOrRent, setSaleOrRent] = useState('rent');
  const [numRooms, setNumRooms] = useState('any');
  const [numBathrooms, setNumBathrooms] = useState('any');
  const [area, setArea] = useState('any');

  const handleClearAll = () => {
    setSaleOrRent('rent');
    setPriceRange([minGlobal, maxGlobal]);
    setNumRooms('any');
    setNumBathrooms('any');
    setArea('any');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-md shadow-lg w-full max-w-2xl mx-4 p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-md font-semibold mb-2">Sale or Rent</h3>
            <div className="flex space-x-2 items-center">
              <button className={`px-4 py-2 rounded-md border ${saleOrRent === 'sale' ? 'bg-[#272727] text-white border-[#272727]' : 'border-gray-300'}`} onClick={() => setSaleOrRent('sale')}>Sale</button>
              <button className={`px-4 py-2 rounded-md border ${saleOrRent === 'rent' ? 'bg-[#272727] text-white border-[#272727]' : 'border-gray-300'}`} onClick={() => setSaleOrRent('rent')}>Rent</button>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Price Range</h3>
            <div className="flex items-end space-x-1 mb-4" style={{ height: '80px' }}>
              {histogramData.map((val, idx) => {
                const inRange = idx >= Math.floor((priceRange[0] - minGlobal) / step) && idx <= Math.floor((priceRange[1] - minGlobal) / step);
                return (
                  <div
                    key={idx}
                    className={`${inRange ? 'bg-[#272727]' : 'bg-gray-400'} w-2 cursor-pointer hover:opacity-75`}
                    style={{ height: `${val * 5}px` }}
                    onClick={() => setPriceRange([barRanges[idx][0], barRanges[idx][1]])}
                  />
                );
              })}
            </div>
            <div className="flex space-x-2">
              <input type="number" className="border rounded-md p-2 w-32" placeholder="Min Price" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} />
              <input type="number" className="border rounded-md p-2 w-32" placeholder="Max Price" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} />
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Select Options</h3>
            <div className="flex space-x-2 items-center">
              <select className="px-4 py-2 rounded-md border border-gray-300" value={numRooms} onChange={(e) => setNumRooms(e.target.value)}>
                <option value="any">Select Rooms</option>
                <option value="1">1 Room</option>
                <option value="2">2 Rooms</option>
                <option value="3">3 Rooms</option>
                <option value="4">4 Rooms</option>
                <option value="5+">5+ Rooms</option>
              </select>
              <select className="px-4 py-2 rounded-md border border-gray-300" value={numBathrooms} onChange={(e) => setNumBathrooms(e.target.value)}>
                <option value="any">Select Bathrooms</option>
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4 Bathrooms</option>
                <option value="5+">5+ Bathrooms</option>
              </select>
              <input type="number" className="px-4 py-2 rounded-md border border-gray-300" placeholder="Area (sq units)" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <button className="text-gray-500 hover:underline" onClick={handleClearAll}>Clear all</button>
          <button onClick={onClose} className="bg-[#272727] text-white px-6 py-2 rounded-md hover:bg-gray-800">Show results</button>
        </div>
      </div>
    </div>
  );
}
