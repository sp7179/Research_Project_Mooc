export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const backendFormData = new FormData()
    backendFormData.append("file", file)

    const response = await fetch(`${backendUrl}/api/predict`, {
      method: "POST",
      body: backendFormData,
    })

    const data = await response.json()

    if (!response.ok) {
      return Response.json(
        { error: data.detail || "Prediction failed" },
        { status: response.status }
      )
    }

    return Response.json(data)

  } catch (error) {
    return Response.json(
      { error: "Server connection failed" },
      { status: 500 }
    )
  }
}