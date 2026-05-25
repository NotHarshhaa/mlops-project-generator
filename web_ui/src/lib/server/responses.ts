import { NextResponse } from "next/server"

export function apiError(detail: string, status: number) {
  return NextResponse.json({ detail }, { status })
}

export function apiJson<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}
