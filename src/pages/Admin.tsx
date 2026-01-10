import { useState, useEffect } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import {
  getOptions,
  createOption,
  updateOption,
  deleteAllVotes,
  uploadOptionImage,
} from '../lib/supabase'
import type { CottageOption } from '../types'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cottage2026admin'

interface AdminProps {
  roomId: string
}

interface NewOptionForm {
  code: string
  nickname: string
  title: string
  location: string
  priceNight: number
  totalEstimate: number
  guests: number
  beds: number
  baths: number
  perks: string
  airbnbUrl: string
  notes: string
}

export default function Admin({ roomId }: AdminProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [options, setOptions] = useState<CottageOption[]>([])
  const [loading, setLoading] = useState(false)
  const [editingOption, setEditingOption] = useState<CottageOption | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newOption, setNewOption] = useState<NewOptionForm>({
    code: '',
    nickname: '',
    title: '',
    location: '',
    priceNight: 0,
    totalEstimate: 0,
    guests: 0,
    beds: 0,
    baths: 0,
    perks: '',
    airbnbUrl: '',
    notes: '',
  })

  useEffect(() => {
    if (authenticated) {
      loadOptions()
    }
  }, [authenticated, roomId])

  const loadOptions = async () => {
    try {
      setLoading(true)
      const data = await getOptions(roomId)
      setOptions(data)
    } catch (err) {
      console.error('Error loading options:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const handleResetVotes = async () => {
    if (!confirm('Are you sure you want to reset ALL votes in this room? This cannot be undone.')) {
      return
    }

    try {
      await deleteAllVotes(roomId)
      alert('All votes have been reset!')
    } catch (err) {
      console.error('Error resetting votes:', err)
      alert('Failed to reset votes. Check console for details.')
    }
  }

  const handleEditOption = (option: CottageOption) => {
    setEditingOption(option)
    setShowEditForm(true)
  }

  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOption) return

    try {
      setLoading(true)
      await updateOption(editingOption.id, {
        nickname: editingOption.nickname,
        title: editingOption.title,
        location: editingOption.location,
        priceNight: editingOption.priceNight,
        totalEstimate: editingOption.totalEstimate,
        guests: editingOption.guests,
        beds: editingOption.beds,
        baths: editingOption.baths,
        perks: editingOption.perks,
        airbnbUrl: editingOption.airbnbUrl,
        imageUrls: editingOption.imageUrls,
        notes: editingOption.notes,
      })
      await loadOptions()
      setShowEditForm(false)
      setEditingOption(null)
      alert('Option updated successfully!')
    } catch (err) {
      console.error('Error updating option:', err)
      alert('Failed to update option. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newOption.code || !newOption.nickname || !newOption.title) {
      alert('Please fill in all required fields (Code, Nickname, Title)')
      return
    }

    try {
      setLoading(true)

      // Upload image if one was selected
      let imageUrl = ''
      if (imageFile) {
        setUploadingImage(true)
        imageUrl = await uploadOptionImage(imageFile, roomId)
        setUploadingImage(false)
      }

      // Create the option
      await createOption({
        roomId,
        code: newOption.code.toUpperCase(),
        nickname: newOption.nickname,
        title: newOption.title,
        location: newOption.location,
        priceNight: newOption.priceNight,
        totalEstimate: newOption.totalEstimate,
        guests: newOption.guests,
        beds: newOption.beds,
        baths: newOption.baths,
        perks: newOption.perks ? newOption.perks.split(',').map((p) => p.trim()) : [],
        airbnbUrl: newOption.airbnbUrl,
        imageUrls: imageUrl ? [imageUrl] : [],
        notes: newOption.notes,
      })

      // Reset form
      setNewOption({
        code: '',
        nickname: '',
        title: '',
        location: '',
        priceNight: 0,
        totalEstimate: 0,
        guests: 0,
        beds: 0,
        baths: 0,
        perks: '',
        airbnbUrl: '',
        notes: '',
      })
      setImageFile(null)
      setImagePreview(null)
      setShowCreateForm(false)
      await loadOptions()
      alert('Option created successfully!')
    } catch (err) {
      console.error('Error creating option:', err)
      alert('Failed to create option. Check console for details.')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-xl p-8 shadow-xl border border-cottage-sand">
          <h2 className="text-3xl font-bold text-cottage-charcoal mb-2">Admin Access</h2>
          <p className="text-cottage-gray mb-6">Enter the admin password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-3 mb-4 border border-cottage-sand focus:border-cottage-green focus:ring-2 focus:ring-cottage-green/20 outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full bg-cottage-green hover:bg-cottage-green/90 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (showCreateForm) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-xl border border-cottage-sand">
          <h2 className="text-3xl font-bold text-cottage-charcoal mb-6">Create New Option</h2>
          <form onSubmit={handleCreateOption} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">
                  Code (A, B, C, D) *
                </label>
                <input
                  type="text"
                  value={newOption.code}
                  onChange={(e) => setNewOption({ ...newOption, code: e.target.value })}
                  maxLength={1}
                  placeholder="A"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">
                  Nickname *
                </label>
                <input
                  type="text"
                  value={newOption.nickname}
                  onChange={(e) => setNewOption({ ...newOption, nickname: e.target.value })}
                  placeholder="e.g., Maple Gateway"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2 font-semibold">Title *</label>
              <input
                type="text"
                value={newOption.title}
                onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                placeholder="e.g., The Maple Gateway"
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2 font-semibold">Location</label>
              <input
                type="text"
                value={newOption.location}
                onChange={(e) => setNewOption({ ...newOption, location: e.target.value })}
                placeholder="e.g., Ontario, Canada"
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">
                  Price per Night
                </label>
                <input
                  type="number"
                  value={newOption.priceNight}
                  onChange={(e) =>
                    setNewOption({ ...newOption, priceNight: parseInt(e.target.value) || 0 })
                  }
                  placeholder="450"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">
                  Total Estimate
                </label>
                <input
                  type="number"
                  value={newOption.totalEstimate}
                  onChange={(e) =>
                    setNewOption({ ...newOption, totalEstimate: parseInt(e.target.value) || 0 })
                  }
                  placeholder="1800"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">Guests</label>
                <input
                  type="number"
                  value={newOption.guests}
                  onChange={(e) =>
                    setNewOption({ ...newOption, guests: parseInt(e.target.value) || 0 })
                  }
                  placeholder="7"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">Bedrooms</label>
                <input
                  type="number"
                  value={newOption.beds}
                  onChange={(e) =>
                    setNewOption({ ...newOption, beds: parseInt(e.target.value) || 0 })
                  }
                  placeholder="4"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2 font-semibold">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={newOption.baths}
                  onChange={(e) =>
                    setNewOption({ ...newOption, baths: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="2.0"
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2 font-semibold">
                Perks (comma separated)
              </label>
              <input
                type="text"
                value={newOption.perks}
                onChange={(e) => setNewOption({ ...newOption, perks: e.target.value })}
                placeholder="e.g., Sleeps 7, Lakefront, Private beach, Fire pit"
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2 font-semibold">Airbnb URL</label>
              <input
                type="url"
                value={newOption.airbnbUrl}
                onChange={(e) => setNewOption({ ...newOption, airbnbUrl: e.target.value })}
                placeholder="https://www.airbnb.ca/rooms/..."
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2 font-semibold">
                Cottage Image
              </label>
              <div className="border-2 border-dashed border-cottage-sand rounded-lg p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-2 right-2 bg-cottage-red text-white p-2 rounded-full hover:bg-cottage-red/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <Upload className="w-8 h-8 text-cottage-gray" />
                    <span className="text-cottage-gray text-sm">Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2 font-semibold">Notes</label>
              <textarea
                value={newOption.notes}
                onChange={(e) => setNewOption({ ...newOption, notes: e.target.value })}
                rows={3}
                placeholder="Optional notes about this option"
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="flex-1 bg-cottage-green hover:bg-cottage-green/90 disabled:bg-cottage-sand text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {uploadingImage
                  ? 'Uploading Image...'
                  : loading
                  ? 'Creating...'
                  : 'Create Option'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setImageFile(null)
                  setImagePreview(null)
                }}
                className="flex-1 bg-white hover:bg-cottage-sand/30 border border-cottage-sand text-cottage-charcoal font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (showEditForm && editingOption) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-xl border border-cottage-sand">
          <h2 className="text-3xl font-bold text-cottage-charcoal mb-6">
            Edit Option {editingOption.code}
          </h2>
          <form onSubmit={handleSaveOption} className="space-y-4">
            <div>
              <label className="block text-cottage-charcoal mb-2">Nickname</label>
              <input
                type="text"
                value={editingOption.nickname}
                onChange={(e) =>
                  setEditingOption({ ...editingOption, nickname: e.target.value })
                }
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2">Title</label>
              <input
                type="text"
                value={editingOption.title}
                onChange={(e) =>
                  setEditingOption({ ...editingOption, title: e.target.value })
                }
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2">Location</label>
              <input
                type="text"
                value={editingOption.location}
                onChange={(e) =>
                  setEditingOption({ ...editingOption, location: e.target.value })
                }
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cottage-charcoal mb-2">Price per Night</label>
                <input
                  type="number"
                  value={editingOption.priceNight}
                  onChange={(e) =>
                    setEditingOption({
                      ...editingOption,
                      priceNight: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2">Total Estimate</label>
                <input
                  type="number"
                  value={editingOption.totalEstimate}
                  onChange={(e) =>
                    setEditingOption({
                      ...editingOption,
                      totalEstimate: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-cottage-charcoal mb-2">Max Guests</label>
                <input
                  type="number"
                  value={editingOption.guests}
                  onChange={(e) =>
                    setEditingOption({ ...editingOption, guests: parseInt(e.target.value) })
                  }
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={editingOption.beds}
                  onChange={(e) =>
                    setEditingOption({ ...editingOption, beds: parseInt(e.target.value) })
                  }
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>

              <div>
                <label className="block text-cottage-charcoal mb-2">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingOption.baths}
                  onChange={(e) =>
                    setEditingOption({ ...editingOption, baths: parseFloat(e.target.value) })
                  }
                  className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2">
                Perks (comma separated)
              </label>
              <input
                type="text"
                value={editingOption.perks.join(', ')}
                onChange={(e) =>
                  setEditingOption({
                    ...editingOption,
                    perks: e.target.value.split(',').map((p) => p.trim()),
                  })
                }
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2">Airbnb URL</label>
              <input
                type="url"
                value={editingOption.airbnbUrl}
                onChange={(e) =>
                  setEditingOption({ ...editingOption, airbnbUrl: e.target.value })
                }
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2">
                Image URLs (comma separated)
              </label>
              <input
                type="text"
                value={editingOption.imageUrls.join(', ')}
                onChange={(e) =>
                  setEditingOption({
                    ...editingOption,
                    imageUrls: e.target.value.split(',').map((u) => u.trim()),
                  })
                }
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div>
              <label className="block text-cottage-charcoal mb-2">Notes</label>
              <textarea
                value={editingOption.notes || ''}
                onChange={(e) =>
                  setEditingOption({ ...editingOption, notes: e.target.value })
                }
                rows={3}
                className="w-full bg-white text-cottage-charcoal rounded-lg px-4 py-2 border border-cottage-sand focus:border-cottage-green outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cottage-green hover:bg-cottage-green/90 disabled:bg-cottage-sand text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false)
                  setEditingOption(null)
                }}
                className="flex-1 bg-white hover:bg-cottage-sand/30 border border-cottage-sand text-cottage-charcoal font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-cottage-charcoal mb-8">Admin Dashboard</h1>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-cottage-green hover:bg-cottage-green/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create New Option
        </button>
        <button
          onClick={handleResetVotes}
          className="bg-cottage-red hover:bg-cottage-red/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          Reset All Votes
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-cottage-charcoal mb-4">Manage Options</h2>
        {loading ? (
          <div className="text-cottage-gray">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => (
              <div
                key={option.id}
                className="bg-white border border-cottage-sand rounded-xl p-6 shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-cottage-green text-white px-3 py-1 rounded-lg font-bold">
                        {option.code}
                      </span>
                      <span className="text-xl font-bold text-cottage-charcoal">
                        {option.nickname}
                      </span>
                    </div>
                    <p className="text-cottage-gray text-sm">{option.location}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-cottage-charcoal mb-4">
                  <div>${option.priceNight}/night • ${option.totalEstimate} total</div>
                  <div>
                    {option.guests} guests • {option.beds} beds • {option.baths} baths
                  </div>
                </div>

                <button
                  onClick={() => handleEditOption(option)}
                  className="w-full bg-cottage-green hover:bg-cottage-green/90 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
