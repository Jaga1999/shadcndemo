import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ShowcaseItem } from "@/models/ShowcaseItem";
import { Error as MongooseError } from 'mongoose';

interface ShowcaseItemData {
  title?: string;
  description?: string;
  code?: string;
  component?: string;
}

interface ValidationError extends MongooseError {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

function validateShowcaseItem(data: ShowcaseItemData): string[] {
  const errors: string[] = [];
  if (!data.title) errors.push("Title is required");
  if (!data.description) errors.push("Description is required");
  if (!data.code) errors.push("Code is required");
  if (!data.component) errors.push("Component is required");
  return errors;
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json() as ShowcaseItemData;
    
    const validationErrors = validateShowcaseItem(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    const item = await ShowcaseItem.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof MongooseError && error.name === 'ValidationError') {
      const validationError = error as ValidationError;
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: Object.values(validationError.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create showcase item" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const component = searchParams.get('component');
    
    const query: { component?: string } = {};
    if (component) {
      query.component = component;
    }

    const items = await ShowcaseItem.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showcase items" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body as { _id: string } & ShowcaseItemData;

    if (!_id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const validationErrors = validateShowcaseItem(updateData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    const item = await ShowcaseItem.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof MongooseError) {
      if (error.name === 'ValidationError') {
        const validationError = error as ValidationError;
        return NextResponse.json(
          { 
            error: "Validation error", 
            details: Object.values(validationError.errors).map(err => err.message)
          },
          { status: 400 }
        );
      }
      if (error.name === 'CastError') {
        return NextResponse.json(
          { error: "Invalid ID format" },
          { status: 400 }
        );
      }
    }
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update showcase item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const item = await ShowcaseItem.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    await ShowcaseItem.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof MongooseError && error.name === 'CastError') {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete showcase item" },
      { status: 500 }
    );
  }
}