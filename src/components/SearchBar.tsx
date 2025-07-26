import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Search, Calendar as CalendarIcon, MapPin, Package } from 'lucide-react'
import { format } from 'date-fns'

interface SearchBarProps {
  onSearch: (filters: {
    campus: string
    startDate: string
    endDate: string
    storageType: string
  }) => void
}

const colleges = [
  'Baylor University',
  'University of Texas at Austin',
  'Texas A&M University',
  'Rice University',
  'Texas Tech University',
  'University of Houston',
  'Texas Christian University',
  'Southern Methodist University',
  'Texas State University',
  'University of North Texas'
]

const storageTypes = [
  { value: 'any', label: 'Any type' },
  { value: 'dorm_room', label: 'Dorm Room' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'garage', label: 'Garage' },
  { value: 'closet', label: 'Closet' },
  { value: 'basement', label: 'Basement' }
]

export function SearchBar({ onSearch }: SearchBarProps) {
  const [campus, setCampus] = useState('Baylor University')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [storageType, setStorageType] = useState('any')

  const handleSearch = () => {
    onSearch({
      campus,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
      storageType
    })
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Campus Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Campus
          </label>
          <div className="relative">
            <Input
              placeholder="Search colleges..."
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="pl-4 bg-white/70 border-gray-300 text-gray-900"
            />
            {campus && (
              <div className="absolute top-full left-0 right-0 glass-card border border-white/30 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {colleges
                  .filter(college => 
                    college.toLowerCase().includes(campus.toLowerCase())
                  )
                  .map((college) => (
                    <button
                      key={college}
                      className="w-full text-left px-4 py-2 hover:bg-white/20 text-sm text-gray-800"
                      onClick={() => setCampus(college)}
                    >
                      {college}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/70 border-gray-300 text-gray-900 hover:bg-white/90"
              >
                {startDate ? format(startDate, 'MMM dd') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            End Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/70 border-gray-300 text-gray-900 hover:bg-white/90"
              >
                {endDate ? format(endDate, 'MMM dd') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Storage Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <Package className="w-4 h-4 mr-1" />
            Storage Type
          </label>
          <Select value={storageType} onValueChange={setStorageType}>
            <SelectTrigger className="bg-white/70 border-gray-300 text-gray-900">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              {storageTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-xl font-medium flex items-center space-x-2 shadow-lg"
        >
          <Search className="w-4 h-4" />
          <span>Search Storage</span>
        </Button>
      </div>
    </div>
  )
}