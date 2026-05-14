import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      )
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        summoner: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      )
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "Connexion réussie",
        user: userWithoutPassword
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    )
  }
}
