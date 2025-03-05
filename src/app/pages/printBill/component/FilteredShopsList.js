import React from 'react'

const FilteredShopsList = ({ filteredShops, handleShopSelect }) => (
    filteredShops.length > 0 && (
        <ul className="absolute z-10 w-[32vw] bg-white border border-gray-300 rounded-md shadow-md mt-1">
            {filteredShops.map((shop) => (
                <li
                    key={shop._id}
                    className="px-4 py-2 flex flex-col hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleShopSelect(shop)}
                >
                    <p>{shop.shopkeeperName}</p>
                    <p className="text-xs text-gray-500">{shop.shopName}</p>
                </li>
            ))}
        </ul>
    )
);

export default FilteredShopsList
