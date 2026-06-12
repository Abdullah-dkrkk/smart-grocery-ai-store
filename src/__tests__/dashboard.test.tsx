import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import DashboardPage from "@/app/dashboard/page"
import { SessionProvider } from "next-auth/react"

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams("") as any),
  useRouter: vi.fn(() => ({ push: vi.fn(), refresh: vi.fn() })),
}))

function renderWithSession(role: string = "user") {
  const session = {
    user: { id: "1", name: "Test User", email: "test@test.com", role },
    expires: new Date(Date.now() + 86400000).toISOString(),
  }

  return render(
    <SessionProvider session={session}>
      <DashboardPage />
    </SessionProvider>
  )
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders user sidebar nav items for user role", async () => {
    renderWithSession("user")
    expect(await screen.findByText("My Orders")).toBeTruthy()
    expect(await screen.findByText("My Profile")).toBeTruthy()
    expect(await screen.findByText("Addresses")).toBeTruthy()
  })

  it("renders super-admin sidebar nav items for super-admin role", async () => {
    renderWithSession("super-admin")
    expect(await screen.findByText("Users")).toBeTruthy()
    expect(await screen.findByText("Vendors")).toBeTruthy()
    expect(await screen.findByText("Analytics")).toBeTruthy()
  })

  it("renders vendor sidebar nav items for vendor role", async () => {
    renderWithSession("vendor")
    expect(await screen.findByText("My Products")).toBeTruthy()
    expect(await screen.findByText("Earnings")).toBeTruthy()
    expect(await screen.findByText("Store Settings")).toBeTruthy()
  })

  it("renders nutritionist sidebar nav items for nutritionist role", async () => {
    renderWithSession("nutritionist")
    expect(await screen.findByText("My Clients")).toBeTruthy()
    expect(await screen.findByText("Meal Plans")).toBeTruthy()
    expect(await screen.findByText("Consultations")).toBeTruthy()
  })

  it("uses role from session, ignoring URL role param", async () => {
    const { useSearchParams } = await import("next/navigation")
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("role=super-admin") as any)

    renderWithSession("user")
    expect(await screen.findByText("My Orders")).toBeTruthy()
    expect(screen.queryByText("Users")).toBeFalsy()
    expect(screen.queryByText("Analytics")).toBeFalsy()
  })
})
