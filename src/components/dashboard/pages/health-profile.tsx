"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Heart, AlertCircle, Save, Loader2, Ruler, Target, Pill } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { healthApi } from "@/lib/api/health"
import { setAuthToken } from "@/lib/api/config"
import type { HealthProfile as HealthProfileType } from "@/lib/api/types"

const dietaryOptions = ["Any", "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "Gluten-Free", "Low-Carb", "High-Protein"]
const activityOptions = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"]

const goalOptions = [
  "Weight Loss",
  "Weight Gain",
  "Muscle Building",
  "Maintain Weight",
  "General Health",
  "Improved Energy",
  "Better Digestion",
]

export function HealthProfile() {
  const { data: session, status: authStatus } = useSession()
  const [profile, setProfile] = useState<HealthProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [goals, setGoals] = useState("")
  const [allergies, setAllergies] = useState("")
  const [dietaryType, setDietaryType] = useState("")
  const [activityLevel, setActivityLevel] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your health profile.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    healthApi.getProfile()
      .then((res) => {
        const data: HealthProfileType = res.data || res
        setProfile(data)
        setAge(data.age?.toString() ?? "")
        setWeight(data.weight?.toString() ?? "")
        setHeight(data.height?.toString() ?? "")
        setGoals(data.goals ?? "")
        setAllergies(data.allergies?.join(", ") ?? "")
        setDietaryType(data.dietary_type ?? "")
        setActivityLevel(data.activity_level ?? "")
        setMedicalConditions(data.medical_conditions ?? "")
      })
      .catch((err) => setError(err.message || "Failed to load health profile."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      await healthApi.updateProfile({
        age: age ? Number(age) : undefined,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        goals: goals || undefined,
        allergies: allergies ? allergies.split(",").map((a) => a.trim()).filter(Boolean) : undefined,
        dietary_type: dietaryType || undefined,
        activity_level: activityLevel || undefined,
        medical_conditions: medicalConditions || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save health profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Health Profile</h2>
          <p className="text-base text-muted-foreground">Loading your health profile...</p>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Health Profile</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load health profile</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const bmi = profile?.bmi

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Health Profile</h2>
        <p className="text-base text-muted-foreground">Manage your health information for personalized nutrition and diet plans.</p>
      </div>

      {bmi && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green/10">
                <Heart className="h-7 w-7 text-brand-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your BMI</p>
                <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">
                  {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-brand-green" />
            Body Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">Age</label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 30" />
          </div>
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" step="0.1" />
          </div>
          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">Height (cm)</label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" step="0.1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-brand-orange" />
            Goals & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="goals" className="text-sm font-medium">Health Goals</label>
            <select id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="" disabled>Select a goal</option>
              {goalOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="dietary" className="text-sm font-medium">Dietary Preference</label>
            <select id="dietary" value={dietaryType} onChange={(e) => setDietaryType(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="" disabled>Select dietary type</option>
              {dietaryOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="activity" className="text-sm font-medium">Activity Level</label>
            <select id="activity" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="" disabled>Select activity level</option>
              {activityOptions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-destructive" />
            Medical & Dietary Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="allergies" className="text-sm font-medium">Allergies (comma-separated)</label>
            <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. peanuts, dairy, gluten" />
          </div>
          <div className="space-y-2">
            <label htmlFor="conditions" className="text-sm font-medium">Medical Conditions</label>
            <textarea id="conditions" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} placeholder="e.g. diabetes, hypertension" rows={3} className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saved && <span className="text-sm text-brand-green font-medium">Health profile updated!</span>}
      </div>

      {error && profile && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
