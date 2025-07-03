import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardFormField } from "@/components/dashboard/DashboardFormField"
import { Search, Loader2 } from "lucide-react"
import { useFoodSearch } from "@/hooks/useFoodSearch"
import type { FoodProduct } from "@/types/food-search"

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
  const {
    results,
    loading,
    error,
    search,
    reset,
    setValue,
  } = useFoodSearch()
  const [showDropdown, setShowDropdown] = useState(false)
  const [visibleCount, setVisibleCount] = useState(15)
  const PAGE_SIZE = 15

  const handleSearchFood = async () => {
    setShowDropdown(false)
    setVisibleCount(PAGE_SIZE)
    setValue(value)
    await search()
    setShowDropdown(true)
  }

  const handleDropdownScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 32 && visibleCount < (results?.length || 0)) {
      setVisibleCount(count => Math.min(count + PAGE_SIZE, results.length))
    }
  }

  React.useEffect(() => {
    reset()
    setVisibleCount(PAGE_SIZE)
    setShowDropdown(false)
  }, [value])

  const getMacroValue = (val: number | string | undefined) => {
    const num = typeof val === 'number' ? val : Number(val)
    if (isNaN(num)) return ""
    return num.toFixed(2)
  }

  const handleSelectResult = (product: FoodProduct) => {
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

  // Extract product weight info (removed unused variable)

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
          disabled={loading || !value.trim()}
          tabIndex={0}
          aria-label="Search food database"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
      {showDropdown && results.length > 0 && (
        <ul
          className="absolute z-30 mt-1 w-full bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-800 rounded shadow-lg max-h-56 overflow-y-auto"
          role="listbox"
          onScroll={handleDropdownScroll}
        >
          {results.slice(0, visibleCount).map((product, idx) => (
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
      {error && !loading && (
        <div className="text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  )
} 