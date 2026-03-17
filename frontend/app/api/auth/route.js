export async function POST(request) {
  try {
    const body = await request.json()

    const { type, ...payload } = body
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const endpoint =
      type === "login"
        ? `${backendUrl}/api/auth/login`
        : `${backendUrl}/api/auth/register`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
    return Response.json(
        { error: data.detail || "Authentication failed" },
        { status: response.status }
    )
    }

    return Response.json(data)
  } 
  
  catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}