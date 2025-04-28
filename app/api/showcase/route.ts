import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ShowcaseItem } from "@/models/ShowcaseItem";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const item = await ShowcaseItem.create(body);
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const items = await ShowcaseItem.find().sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    const item = await ShowcaseItem.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await ShowcaseItem.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}