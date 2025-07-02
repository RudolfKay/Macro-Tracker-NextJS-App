import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardFormField } from "@/components/dashboard/DashboardFormField"
import { Search, Loader2 } from "lucide-react"

type Macros = {
  name: string
  protein: string
  carbs: string
  fat: string
  calories: string
}

type FoodSearchDropdownProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelect: (macros: Macros) => void
  placeholder?: string
  className?: string
}

export const FoodSearchDropdown: React.FC<FoodSearchDropdownProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "e.g., Chicken Breast (200g)",
  className = "",
}) => {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const handleSearchFood = async () => {
    if (!value.trim()) return
    setIsSearching(true)
    setSearchError(null)
    setShowDropdown(false)
    setHasSearched(true)
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(value)}&search_simple=1&action=process&json=1&page_size=15`)
      const data = await res.json()
      if (data.products && data.products.length > 0) {
        setSearchResults(data.products.slice(0, 15))
        setShowDropdown(true)
        setSearchError(null)
      } else {
        setSearchResults([])
        setShowDropdown(false)
        setSearchError(`No results found for "${value}".`)
      }
    } catch (err) {
      setSearchError("Error searching food database.")
      setSearchResults([])
      setShowDropdown(false)
    } finally {
      setIsSearching(false)
    }
  }

  const getMacroValue = (val: any) => {
    const num = Number(val)
    if (isNaN(num)) return ""
    return num.toFixed(2)
  }

  const handleSelectResult = (product: any) => {
    setSelectedProduct(product)
    // Return macros per 100g
    const macros100g = {
      name: product.product_name || value,
      protein: getMacroValue(product.nutriments?.proteins_100g),
      carbs: getMacroValue(product.nutriments?.carbohydrates_100g),
      fat: getMacroValue(product.nutriments?.fat_100g),
      calories: getMacroValue(product.nutriments?.["energy-kcal_100g"]),
    }
    onSelect(macros100g)
    setShowDropdown(false)
  }

  // Extract product weight info
  let productWeight = "Unknown"
  if (selectedProduct) {
    if (selectedProduct.product_quantity) {
      productWeight = `${selectedProduct.product_quantity}g`
    } else if (selectedProduct.quantity) {
      productWeight = selectedProduct.quantity
    } else if (selectedProduct.serving_size) {
      productWeight = selectedProduct.serving_size
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end">
        <div className="flex-1">
          <DashboardFormField
            label="Food Name"
            id="food-name"
            value={value}
            onChange={e => {
              onChange(e)
              setShowDropdown(false)
              setHasSearched(false)
              setSelectedProduct(null)
            }}
            placeholder={placeholder}
            required
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-[40px] w-[40px] min-w-[40px] ml-2 flex items-center justify-center"
          onClick={handleSearchFood}
          disabled={isSearching || !value.trim()}
          tabIndex={0}
          aria-label="Search food database"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      {showDropdown && searchResults.length > 0 && (
        <ul className="absolute z-30 mt-1 w-full bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-800 rounded shadow-lg max-h-56 overflow-y-auto" role="listbox">
          {searchResults.map((product, idx) => (
            <li
              key={product.id || idx}
              className="px-3 py-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-800 text-sm"
              tabIndex={0}
              aria-label={`Select ${product.product_name || product.generic_name || 'food'}`}
              onClick={() => handleSelectResult(product)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleSelectResult(product)
              }}
            >
              <span className="font-medium">{product.product_name || product.generic_name || "Unnamed"}</span>
              {product.brands && (
                <span className="ml-2 text-xs text-muted-foreground">{product.brands}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {hasSearched && searchError && !isSearching && (
        <div className="text-xs text-red-600 mt-1">{searchError}</div>
      )}
    </div>
  )
} 