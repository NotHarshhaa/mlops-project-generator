import { apiJson, FORM_OPTIONS } from "@/lib/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return apiJson(FORM_OPTIONS)
}
