"use client";

import { useEffect, useState } from "react";
import { PlusCircle, ArrowUpDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toastMessage } from "@/lib/utils";

interface ShowcaseItem {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    priority: 3,
  });
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortField, setSortField] = useState<keyof ShowcaseItem>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<ShowcaseItem["status"] | "all">("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/showcase");
      const data = await response.json();
      if (response.ok) {
        setItems(data);
      } else {
        console.error("Failed to fetch items:", data.error);
        toastMessage(data.error, "error");
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toastMessage("Failed to fetch items. Please try again.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok) {
        toastMessage("Item created successfully");
        setIsDialogOpen(false);
        setFormData({ title: "", description: "", status: "draft", priority: 3 });
        fetchItems();
      } else {
        console.error("Failed to create item:", data.error);
        toastMessage(data.error, "error");
      }
    } catch (error) {
      console.error("Failed to create item:", error);
      toastMessage("Failed to create item. Please try again.", "error");
    }
  };

  const handleUpdate = async (id: string, updateData: Partial<ShowcaseItem>) => {
    try {
      const response = await fetch("/api/showcase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updateData }),
      });
      const data = await response.json();
      
      if (response.ok) {
        toastMessage("Item updated successfully");
        setIsEditing(false);
        fetchItems();
      } else {
        console.error("Failed to update item:", data.error);
        toastMessage(data.error, "error");
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      toastMessage("Failed to update item. Please try again.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/showcase?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toastMessage("Item deleted successfully");
        setSelectedItem(null);
        fetchItems();
      } else {
        const data = await response.json();
        console.error("Failed to delete item:", data.error);
        toastMessage(data.error, "error");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toastMessage("Failed to delete item. Please try again.", "error");
    }
  };

  const getStatusColor = (status: ShowcaseItem["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "archived":
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
      case "draft":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "";
    }
  };

  const sortItems = (a: ShowcaseItem, b: ShowcaseItem) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    const aNum = typeof aValue === "number" ? aValue : 0;
    const bNum = typeof bValue === "number" ? bValue : 0;
    
    return sortDirection === "asc"
      ? aNum - bNum
      : bNum - aNum;
  };

  const filteredAndSortedItems = items
    .filter(item => statusFilter === "all" || item.status === statusFilter)
    .sort(sortItems);

  const toggleSort = (field: keyof ShowcaseItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <h1 className="text-xl font-semibold">Component Showcase</h1>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Select
              value={statusFilter}
              onValueChange={(value: ShowcaseItem["status"] | "all") => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Create New Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to the showcase collection.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        className="col-span-3"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        className="col-span-3"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="5"
                        className="col-span-3"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("title")}
                  >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("status")}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("priority")}
                  >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("createdAt")}
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditing(false);
                          }}
                        >
                          View Details
                        </Button>
                      </SheetTrigger>
                      {selectedItem && selectedItem._id === item._id && (
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>
                              {isEditing ? "Edit Item" : selectedItem.title}
                            </SheetTitle>
                            <SheetDescription>
                              {isEditing ? "Modify item details" : "Item Details and Management"}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="py-4">
                            {isEditing ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Title</Label>
                                  <Input
                                    value={selectedItem.title}
                                    onChange={(e) =>
                                      setSelectedItem(prev => 
                                        prev ? { ...prev, title: e.target.value } : prev
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <Input
                                    value={selectedItem.description}
                                    onChange={(e) =>
                                      setSelectedItem(prev =>
                                        prev ? { ...prev, description: e.target.value } : prev
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Select
                                    value={selectedItem.status}
                                    onValueChange={(value: ShowcaseItem["status"]) =>
                                      setSelectedItem(prev =>
                                        prev ? { ...prev, status: value } : prev
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="draft">Draft</SelectItem>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Priority</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={selectedItem.priority}
                                    onChange={(e) =>
                                      setSelectedItem(prev =>
                                        prev ? { ...prev, priority: parseInt(e.target.value) } : prev
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium">Description</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedItem.description}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Status</h4>
                                  <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(selectedItem.status)}`}>
                                    {selectedItem.status}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Priority</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedItem.priority}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Created At</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedItem.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Last Updated</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(selectedItem.updatedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="mt-6 flex justify-end space-x-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => handleUpdate(selectedItem._id, selectedItem)}
                                  >
                                    Save Changes
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(selectedItem._id)}
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </SheetContent>
                      )}
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}