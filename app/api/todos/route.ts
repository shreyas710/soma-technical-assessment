import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, dueDate } = await request.json();
    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    let imageUrl: string | null = null;
    try {
      const q = encodeURIComponent(title);
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${q}&per_page=1`,
        {
          headers: {
            Authorization: process.env.PEXELS_API_KEY || "",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const first = data?.photos?.[0];
        imageUrl =
          first?.src?.medium ||
          first?.src?.landscape ||
          first?.src?.original ||
          null;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        imageUrl,
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating todo" }, { status: 500 });
  }
}
